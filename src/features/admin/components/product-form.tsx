'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, MapPin, Plus, X } from 'lucide-react'
import { createAdminProduct, updateAdminProduct } from '../actions/product-actions'
import { cn } from '@/shared/lib/cn'
import { createStampLocation } from '../actions/stamp-location-actions'
import { ToggleGroupInteractive } from './toggle-group-interactive'
import { StampSizeInteractive } from './stamp-size-interactive'
import { ProductImagesManager } from './product-images-manager'
import { uploadToCloudinary } from '../lib/upload-to-cloudinary'
import type { AdminProduct } from '../types'
import type { ProductColor, ProductImage } from '@/entities/product'
import { ProductFormField } from '../products/ui/product-form-field'
import { SIZE_OPTIONS, slugifyProductName, STAMP_SIZE_OPTIONS } from '../products/lib/product-form'

function stripDorsoStampLocations(locations: string[]) {
  return locations.filter((loc) => !loc.toLowerCase().includes('dorso'))
}
import { normalizeProductImages } from '@/entities/product/images'
import { evaluateProductQuality } from '../lib/product-quality'

interface ProductFormProps {
  product?: AdminProduct
  categories: { name: string; subcategories: string[] }[]
  stampLocations: string[]
  globalColors?: { id: string; name: string; hex: string }[]
}

export function ProductForm({
  product,
  categories,
  stampLocations: stampLocationsProp,
  globalColors = [],
}: ProductFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [serverError, setServerError] = useState('')

  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [slugLocked, setSlugLocked] = useState(!!product)
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(product?.price?.toString() ?? '')
  const [stock, setStock] = useState(product?.stock?.toString() ?? '0')
  const [shippingWeightGrams, setShippingWeightGrams] = useState(product?.shippingWeightGrams?.toString() ?? '')
  const [shippingHeightCm, setShippingHeightCm] = useState(product?.shippingHeightCm?.toString() ?? '')
  const [shippingWidthCm, setShippingWidthCm] = useState(product?.shippingWidthCm?.toString() ?? '')
  const [shippingLengthCm, setShippingLengthCm] = useState(product?.shippingLengthCm?.toString() ?? '')
  const [category, setCategory] = useState(product?.category ?? '')
  const [customCategory, setCustomCategory] = useState(
    product?.category && !categories.some(c => c.name === product.category) ? product.category : '',
  )
  const [useCustomCategory, setUseCustomCategory] = useState(
    !!product?.category && !categories.some(c => c.name === product.category),
  )
  const [subcategory, setSubcategory] = useState(product?.subcategory ?? '')
  const [images, setImages] = useState<ProductImage[]>(() => normalizeProductImages(product ?? {}))
  const [uploadError, setUploadError] = useState('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [clearedImageAssignments, setClearedImageAssignments] = useState(0)
  const [active, setActive] = useState(product?.active ?? true)

  // Colors
  const [availableColors, setAvailableColors] = useState<ProductColor[]>(
    product?.availableColors ?? [],
  )

  // Sizes
  const [availableSizes, setAvailableSizes] = useState<string[]>(product?.availableSizes ?? [])

  // Stamp sizes
  const [stampSizes, setStampSizes] = useState<string[]>(product?.stampSizes ?? [])

  // Stamp locations
  const [allStampLocations, setAllStampLocations] = useState<string[]>(stampLocationsProp)
  const [selectedStampLocations, setSelectedStampLocations] = useState<string[]>(
    product?.stampLocations ?? [],
  )
  const [addingLocation, setAddingLocation] = useState(false)
  const [newLocationInput, setNewLocationInput] = useState('')
  const [locationError, setLocationError] = useState('')
  const [isAddingLocation, startLocationTransition] = useTransition()

  const allCategories = categories.map(c => c.name)

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setName(val)
    if (!slugLocked) setSlug(slugifyProductName(val))
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(slugifyProductName(e.target.value))
    setSlugLocked(true)
  }

  function handleAddLocation() {
    setLocationError('')
    startLocationTransition(async () => {
      const result = await createStampLocation(newLocationInput)
      if ('error' in result) {
        setLocationError(result.error)
        return
      }
      setAllStampLocations((prev) => [...prev, result.name])
      setSelectedStampLocations((prev) => [...prev, result.name])
      setNewLocationInput('')
      setAddingLocation(false)
    })
  }

  async function handleImageUpload(file: File) {
    setUploadError('')
    setIsUploadingImage(true)
    const { url, error } = await uploadToCloudinary(file)
    setIsUploadingImage(false)
    if (!url) {
      setUploadError(error)
      return
    }
    setImages((prev) => [...prev, { url, colorName: null }])
  }

  function toggleAvailableColor(color: { name: string; hex: string }) {
    const normalizedName = color.name.toLowerCase()
    const isSelected = availableColors.some((currentColor) => currentColor.name.toLowerCase() === normalizedName)

    if (!isSelected) {
      setAvailableColors((prev) => [...prev, { name: color.name, hex: color.hex }])
      return
    }

    setAvailableColors((prev) =>
      prev.filter((currentColor) => currentColor.name.toLowerCase() !== normalizedName),
    )

    const removedAssignments = images.filter(
      (image) => image.colorName?.toLowerCase() === normalizedName,
    ).length

    const nextImages = images.map((image) => {
      if (image.colorName?.toLowerCase() !== normalizedName) return image

      return {
        ...image,
        colorName: null,
      }
    })

    setImages(nextImages)

    if (removedAssignments > 0) {
      setClearedImageAssignments((current) => current + removedAssignments)
    }
  }

  const effectiveCategory = useCustomCategory ? customCategory : category
  const isCapCategory = effectiveCategory.toLowerCase().includes('gorra')
  const selectedCategorySubs = categories.find(c => c.name === effectiveCategory)?.subcategories ?? []

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setServerError('')

    if (isUploadingImage) {
      setServerError('Esperá a que termine la subida de la imagen antes de guardar.')
      return
    }

    const normalizedImages = images
      .map((image) => ({
        url: image.url.trim(),
        colorName: image.colorName?.trim() || undefined,
      }))
      .filter((image) => image.url.length > 0)

    const input = {
      slug,
      name,
      description: description.trim() || undefined,
      price: Number(price),
      stock: Number(stock),
      shippingWeightGrams: Number(shippingWeightGrams),
      shippingHeightCm: Number(shippingHeightCm),
      shippingWidthCm: Number(shippingWidthCm),
      shippingLengthCm: Number(shippingLengthCm),
      images: normalizedImages,
      category: effectiveCategory,
      subcategory: selectedCategorySubs.length > 0 ? subcategory : '',
      active,
      availableColors,
      availableSizes,
      stampSizes,
      stampLocations: isCapCategory ? stripDorsoStampLocations(selectedStampLocations) : selectedStampLocations,
    }

    startTransition(async () => {
      const result = product
        ? await updateAdminProduct(product.id, input)
        : await createAdminProduct(input)

      if (result?.error) {
        const fieldErrors = result.error.fieldErrors as Record<string, string[]>
        setErrors(fieldErrors)
        const formErrors = result.error.formErrors
        if (formErrors?.length) setServerError(formErrors[0] ?? '')
        return
      }

      router.push('/admin/productos')
      router.refresh()
    })
  }

  const isEditing = !!product
  const quality = evaluateProductQuality({
    name,
    description,
    price: Number(price) || 0,
    stock: Number(stock) || 0,
    shippingWeightGrams: Number(shippingWeightGrams) || 0,
    shippingHeightCm: Number(shippingHeightCm) || 0,
    shippingWidthCm: Number(shippingWidthCm) || 0,
    shippingLengthCm: Number(shippingLengthCm) || 0,
    images,
    category: effectiveCategory,
    active,
  })
  const publishBlocked = quality.blockers.length > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Back link + title */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/productos"
          className="p-2 border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          aria-label="Volver"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        </Link>
        <div>
          <h1 className="font-serif text-2xl text-foreground">
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </h1>
          {isEditing && (
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">{product.slug}</p>
          )}
        </div>
      </div>

      {serverError && (
        <div className="border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Left column — main fields */}
        <div className="space-y-6">
          <div className="bg-background border border-border p-6 space-y-6">
            <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground border-b border-border pb-3">
              Información básica
            </p>

            <ProductFormField label="Nombre" error={errors.name?.[0]} required>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Ej: Remera Lino Oversize"
                className="w-full px-3 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-none placeholder:text-muted-foreground"
              />
            </ProductFormField>

            <ProductFormField label="Slug (URL)" error={errors.slug?.[0]} required>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={slug}
                  onChange={handleSlugChange}
                  placeholder="remera-lino-oversize"
                  className="flex-1 px-3 py-2.5 border border-border bg-background text-sm font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-none placeholder:text-muted-foreground"
                />
                {slugLocked && (
                  <button
                    type="button"
                    onClick={() => {
                      setSlug(slugifyProductName(name))
                      setSlugLocked(false)
                    }}
                    className="px-3 py-2.5 text-2xs font-medium tracking-widest uppercase border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors whitespace-nowrap"
                  >
                    Regenerar
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                /productos/<span className="text-foreground">{slug || '...'}</span>
              </p>
            </ProductFormField>

            <ProductFormField label="Descripción" error={errors.description?.[0]}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Describe el producto: materiales, talle, fit, cuidados..."
                className="w-full px-3 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-none placeholder:text-muted-foreground resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">{description.length}/2000</p>
            </ProductFormField>
          </div>

          <div className="bg-background border border-border p-6 space-y-6">
            <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground border-b border-border pb-3">
              Precio, categoría y color
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProductFormField label="Precio (ARS)" error={errors.price?.[0]} required>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    $
                  </span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-none placeholder:text-muted-foreground tabular-nums"
                  />
                </div>
              </ProductFormField>

              <ProductFormField label="Stock" error={errors.stock?.[0]} required>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0"
                  step="1"
                  inputMode="numeric"
                  placeholder="0"
                  className="w-full px-3 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-none placeholder:text-muted-foreground tabular-nums"
                />
              </ProductFormField>

              <ProductFormField label="Categoría" error={errors.category?.[0]} required>
                {!useCustomCategory ? (
                  <div className="space-y-2">
                    <select
                      value={category}
                      onChange={(e) => {
                        const next = e.target.value
                        setCategory(next)
                        setSubcategory('')
                        const nextEffective = useCustomCategory ? customCategory : next
                        if (nextEffective.toLowerCase().includes('gorra')) {
                          setSelectedStampLocations((prev) => stripDorsoStampLocations(prev))
                        }
                      }}
                      className="w-full px-3 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-none"
                    >
                      <option value="">Seleccionar...</option>
                      {allCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setUseCustomCategory(true)}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
                    >
                      + Crear nueva categoría
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => {
                        const val = e.target.value
                        setCustomCategory(val)
                        if (val.toLowerCase().includes('gorra')) {
                          setSelectedStampLocations((prev) => stripDorsoStampLocations(prev))
                        }
                      }}
                      placeholder="Nombre de la categoría"
                      className="w-full px-3 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-none placeholder:text-muted-foreground"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setUseCustomCategory(false)
                        setCustomCategory('')
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                    >
                      ← Volver a categorías existentes
                    </button>
                  </div>
                )}
              </ProductFormField>

              {selectedCategorySubs.length > 0 && (
                <ProductFormField label="Subcategoría">
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full px-3 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-none"
                  >
                    <option value="">Sin subcategoría</option>
                    {selectedCategorySubs.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </ProductFormField>
              )}
            </div>

            <div className="space-y-3 border-t border-border pt-6">
              <div className="space-y-1">
                <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground">
                  Colores disponibles
                </p>
                <p className="text-sm text-muted-foreground">
                  Seleccioná primero los colores habilitados para que luego puedan vincularse a cada imagen.
                </p>
              </div>

              {globalColors.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No hay colores globales configurados.{' '}
                  <a href="/admin/colores" className="underline underline-offset-2 hover:text-primary transition-colors">
                    Agregar en Colores
                  </a>
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {globalColors.map((gc) => {
                    const isSelected = availableColors.some(
                      (c) => c.name.toLowerCase() === gc.name.toLowerCase(),
                    )
                    return (
                      <button
                        key={gc.id}
                        type="button"
                        onClick={() => toggleAvailableColor(gc)}
                        aria-pressed={isSelected}
                        aria-label={`${isSelected ? 'Quitar' : 'Agregar'} color ${gc.name}`}
                        title={gc.name}
                        className={cn(
                          'flex min-h-[44px] items-center gap-1.5 border px-3 py-2 text-xs transition-colors',
                          isSelected
                            ? 'border-primary text-foreground bg-primary/5'
                            : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground',
                        )}
                      >
                        <span
                          className="w-3.5 h-3.5 shrink-0 border border-border/50"
                          style={{ backgroundColor: gc.hex }}
                          aria-hidden="true"
                        />
                        {gc.name}
                        {isSelected && <X className="h-3 w-3 shrink-0 text-primary" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="bg-background border border-border p-6 space-y-6">
            <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground border-b border-border pb-3">
              Logística de envío
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ProductFormField label="Peso (gramos)" error={errors.shippingWeightGrams?.[0]} required>
                <input
                  type="number"
                  value={shippingWeightGrams}
                  onChange={(e) => setShippingWeightGrams(e.target.value)}
                  min="1"
                  step="1"
                  inputMode="numeric"
                  placeholder="500"
                  className="w-full px-3 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-none placeholder:text-muted-foreground tabular-nums"
                />
              </ProductFormField>

              <ProductFormField label="Alto (cm)" error={errors.shippingHeightCm?.[0]} required>
                <input
                  type="number"
                  value={shippingHeightCm}
                  onChange={(e) => setShippingHeightCm(e.target.value)}
                  min="1"
                  step="1"
                  inputMode="numeric"
                  placeholder="5"
                  className="w-full px-3 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-none placeholder:text-muted-foreground tabular-nums"
                />
              </ProductFormField>

              <ProductFormField label="Ancho (cm)" error={errors.shippingWidthCm?.[0]} required>
                <input
                  type="number"
                  value={shippingWidthCm}
                  onChange={(e) => setShippingWidthCm(e.target.value)}
                  min="1"
                  step="1"
                  inputMode="numeric"
                  placeholder="25"
                  className="w-full px-3 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-none placeholder:text-muted-foreground tabular-nums"
                />
              </ProductFormField>

              <ProductFormField label="Largo (cm)" error={errors.shippingLengthCm?.[0]} required>
                <input
                  type="number"
                  value={shippingLengthCm}
                  onChange={(e) => setShippingLengthCm(e.target.value)}
                  min="1"
                  step="1"
                  inputMode="numeric"
                  placeholder="30"
                  className="w-full px-3 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-none placeholder:text-muted-foreground tabular-nums"
                />
              </ProductFormField>
            </div>

            <p className="text-xs text-muted-foreground">
              Estos datos se usan para cotizar e importar el envío con Correo Argentino.
            </p>
          </div>

          <ProductImagesManager
            images={images}
            availableColors={availableColors}
            isUploading={isUploadingImage}
            uploadError={uploadError}
            validationError={errors.images?.[0]}
            clearedAssignments={clearedImageAssignments}
            onUpload={handleImageUpload}
            onImagesChange={(nextImages) => {
              setImages(nextImages)
              setClearedImageAssignments(0)
            }}
          />

          {/* Customization options */}
          <div className="bg-background border border-border p-6 space-y-6">
            <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground border-b border-border pb-3">
              Opciones de personalización
            </p>
            <div className="space-y-3">
              <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground">
                Talles disponibles
              </p>
              <ToggleGroupInteractive
                options={SIZE_OPTIONS}
                selected={availableSizes}
                onChange={setAvailableSizes}
                label="talles"
              />
            </div>

            <div className="space-y-3">
              <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground">
                Tamaños de estampa
              </p>
              <StampSizeInteractive
                options={STAMP_SIZE_OPTIONS}
                selected={stampSizes}
                onChange={setStampSizes}
              />
            </div>

            {/* Stamp locations */}
            <div className="space-y-2">
              <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground">
                Ubicaciones de estampa
              </p>

              {allStampLocations.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {allStampLocations.map((loc) => {
                    const isBackLocation = loc.toLowerCase().includes('dorso')
                    const isDisabledForCaps = isCapCategory && isBackLocation

                    return (
                      <label key={loc} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStampLocations.includes(loc)}
                          disabled={isDisabledForCaps}
                          onChange={() =>
                            setSelectedStampLocations((prev) =>
                              prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc],
                            )
                          }
                          className="h-3.5 w-3.5 accent-primary"
                        />
                        <span className={cn('text-xs', isDisabledForCaps ? 'text-muted-foreground' : 'text-foreground')}>
                          {loc}
                        </span>
                      </label>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-5 px-4 text-center">
                  <MapPin className="h-5 w-5 text-muted-foreground/50" />
                  <p className="text-xs text-muted-foreground">No hay ubicaciones creadas todavía.</p>
                </div>
              )}

              {addingLocation ? (
                <div className="flex flex-wrap gap-2 items-center mt-2">
                  <input
                    type="text"
                    value={newLocationInput}
                    onChange={(e) => setNewLocationInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (!isAddingLocation && newLocationInput.trim()) {
                          handleAddLocation()
                        }
                      }
                    }}
                    placeholder="Ej: Pecho izquierdo"
                    autoFocus
                    className="px-2 py-2 border border-border bg-background text-sm w-full sm:w-48 focus:outline-none focus:border-primary rounded-none placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    disabled={isAddingLocation || !newLocationInput.trim()}
                    onClick={handleAddLocation}
                    className="flex items-center gap-1 px-3 py-2 text-xs border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isAddingLocation ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      'Guardar'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddingLocation(false)
                      setNewLocationInput('')
                      setLocationError('')
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingLocation(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors mt-1"
                >
                  <Plus className="h-3 w-3" />
                  Agregar ubicación
                </button>
              )}
              {locationError && <p className="text-xs text-primary">{locationError}</p>}
            </div>
          </div>
        </div>

        {/* Right column — status + actions */}
        <div className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <div className="bg-background border border-border p-6 space-y-4 rounded-[1.5rem] shadow-[0_20px_50px_rgba(10,15,20,0.06)]">
            <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground border-b border-border pb-3">
              Visibilidad
            </p>

            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <p className="text-sm font-medium text-foreground">Producto activo</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {active ? 'Visible en la tienda' : 'Oculto en la tienda'}
                </p>
              </div>
              <div
                onClick={() => setActive(!active)}
                className={`relative h-6 w-11 rounded-full border transition-colors cursor-pointer ${
                  active ? 'border-primary bg-primary/15' : 'border-border bg-surface'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-background shadow-sm transition-transform ${
                    active ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </label>

            <div className={`rounded-[1.15rem] border px-4 py-4 ${
              quality.status === 'ready'
                ? 'border-emerald-500/20 bg-emerald-500/10'
                : quality.status === 'attention'
                  ? 'border-amber-500/25 bg-amber-500/10'
                  : 'border-error-border bg-error-subtle'
            }`}>
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Estado de publicación
              </p>
              <p className="mt-2 text-sm text-foreground">
                {quality.status === 'ready'
                  ? 'Listo para salir a tienda.'
                  : quality.status === 'attention'
                    ? 'Publicable, pero conviene mejorar la calidad visual.'
                    : 'No cumple los mínimos para producción.'}
              </p>

              {quality.blockers.length > 0 ? (
                <ul className="mt-3 space-y-2 text-xs leading-relaxed text-error-foreground">
                  {quality.blockers.map((blocker) => (
                    <li key={blocker}>• {blocker}</li>
                  ))}
                </ul>
              ) : null}

              {quality.warnings.length > 0 ? (
                <ul className="mt-3 space-y-2 text-xs leading-relaxed text-foreground/72">
                  {quality.warnings.map((warning) => (
                    <li key={warning}>• {warning}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          {/* Summary card */}
          <div className="bg-surface border border-border p-6 space-y-3 rounded-[1.5rem]">
            <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground">
              Resumen
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nombre</span>
                <span className="text-foreground font-medium truncate ml-4 max-w-[140px] text-right">
                  {name || '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categoría</span>
                <span className="text-foreground font-medium">{effectiveCategory || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Precio</span>
                <span className="text-foreground font-semibold">
                  {price ? `$${Number(price).toLocaleString('es-AR')}` : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock</span>
                <span className="text-foreground font-medium">{stock || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado</span>
                <span className={active ? 'text-primary font-medium' : 'text-muted-foreground'}>
                  {active ? 'Activo' : 'Borrador'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Imágenes</span>
                <span className="text-foreground font-medium">{images.length}</span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending || isUploadingImage}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-4 text-xs font-medium tracking-[0.26em] uppercase hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando…
              </>
            ) : isEditing ? (
              'Guardar cambios'
            ) : (
              'Crear producto'
            )}
          </button>

          {publishBlocked ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              Si querés dejarlo activo, primero resolvé los bloqueos de publicación marcados arriba.
            </p>
          ) : null}

          {isEditing && (
            <Link
              href={`/productos/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground px-6 py-3 text-xs font-medium tracking-[0.22em] uppercase transition-colors"
            >
              Ver en tienda ↗
            </Link>
          )}

          <Link
            href="/admin/productos"
            className="block w-full text-center text-muted-foreground hover:text-foreground px-6 py-2 text-xs transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </div>
    </form>
  )
}
