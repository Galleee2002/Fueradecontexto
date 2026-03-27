'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ImageOff, Loader2 } from 'lucide-react'
import { createAdminProduct, updateAdminProduct } from '../actions/product-actions'
import type { AdminProduct } from '../types'
const COLOR_PALETTE = ['Negro', 'Blanco', 'Camel', 'Fucsia', 'Marengo', 'Rojo', 'Verde', 'Azul', 'Gris']
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
const STAMP_SIZE_OPTIONS = ['Pequeña', 'Mediana', 'Grande']
const STAMP_LOCATION_OPTIONS = ['Pecho izquierdo', 'Pecho derecho', 'Espalda', 'Manga izquierda', 'Manga derecha']

interface ProductFormProps {
  product?: AdminProduct
  categories: string[]
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '')
}

function FormField({
  label,
  error,
  required,
  children,
}: {
  label: string
  error?: string | undefined
  required?: boolean | undefined
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-2xs font-medium tracking-widest uppercase text-muted-foreground">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-primary">{error}</p>
      )}
    </div>
  )
}

function CheckboxGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
}) {
  function toggle(option: string) {
    onChange(
      selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option]
    )
  }
  return (
    <div className="space-y-2">
      <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => toggle(option)}
              className="h-3.5 w-3.5 accent-primary"
            />
            <span className="text-xs text-foreground">{option}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [serverError, setServerError] = useState('')

  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [slugLocked, setSlugLocked] = useState(!!product)
  const [description, setDescription] = useState(product?.description ?? '')
  const [price, setPrice] = useState(product?.price?.toString() ?? '')
  const [category, setCategory] = useState(product?.category ?? '')
  const [customCategory, setCustomCategory] = useState(
    product?.category && !categories.includes(product.category) ? product.category : '',
  )
  const [useCustomCategory, setUseCustomCategory] = useState(
    !!product?.category && !categories.includes(product.category),
  )
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? '')
  const [imagePreview, setImagePreview] = useState(product?.imageUrl ?? '')
  const [active, setActive] = useState(product?.active ?? true)
  const [availableColors, setAvailableColors] = useState<string[]>(product?.availableColors ?? [])
  const [availableSizes, setAvailableSizes] = useState<string[]>(product?.availableSizes ?? [])
  const [stampSizes, setStampSizes] = useState<string[]>(product?.stampSizes ?? [])
  const [stampLocations, setStampLocations] = useState<string[]>(product?.stampLocations ?? [])

  const allCategories = categories

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setName(val)
    if (!slugLocked) {
      setSlug(slugify(val))
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(slugify(e.target.value))
    setSlugLocked(true)
  }

  function handleImageUrlBlur() {
    setImagePreview(imageUrl)
  }

  const effectiveCategory = useCustomCategory ? customCategory : category

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setServerError('')

    const input = {
      slug,
      name,
      description: description.trim() || undefined,
      price: Number(price),
      imageUrl,
      category: effectiveCategory,
      active,
      availableColors,
      availableSizes,
      stampSizes,
      stampLocations,
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

            <FormField label="Nombre" error={errors.name?.[0]} required>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Ej: Remera Lino Oversize"
                className="w-full px-3 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-none placeholder:text-muted-foreground"
              />
            </FormField>

            <FormField
              label="Slug (URL)"
              error={errors.slug?.[0]}
              required
            >
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
                      setSlug(slugify(name))
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
            </FormField>

            <FormField label="Descripción" error={errors.description?.[0]}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Describe el producto: materiales, talle, fit, cuidados..."
                className="w-full px-3 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-none placeholder:text-muted-foreground resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {description.length}/2000
              </p>
            </FormField>
          </div>

          <div className="bg-background border border-border p-6 space-y-6">
            <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground border-b border-border pb-3">
              Precio y categoría
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField label="Precio (ARS)" error={errors.price?.[0]} required>
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
              </FormField>

              <FormField label="Categoría" error={errors.category?.[0]} required>
                {!useCustomCategory ? (
                  <div className="space-y-2">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
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
                      onChange={(e) => setCustomCategory(e.target.value)}
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
              </FormField>
            </div>
          </div>

          <div className="bg-background border border-border p-6 space-y-4">
            <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground border-b border-border pb-3">
              Imagen del producto
            </p>

            <FormField label="URL de imagen" error={errors.imageUrl?.[0]} required>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onBlur={handleImageUrlBlur}
                placeholder="https://ejemplo.com/imagen.webp"
                className="w-full px-3 py-2.5 border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded-none placeholder:text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">
                Pegá la URL de la imagen (Cloudinary, Uploadthing, etc.)
              </p>
            </FormField>

            {/* Preview */}
            {imagePreview ? (
              <div className="relative aspect-[3/4] w-40 bg-surface border border-border overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  sizes="160px"
                  className="object-cover"
                  onError={() => setImagePreview('')}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-40 aspect-[3/4] bg-surface border border-border border-dashed text-muted-foreground">
                <ImageOff className="h-8 w-8 opacity-40" strokeWidth={1} />
              </div>
            )}
          </div>

          <div className="bg-background border border-border p-6 space-y-6">
            <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground border-b border-border pb-3">
              Opciones de personalización
            </p>

            <CheckboxGroup
              label="Colores disponibles"
              options={COLOR_PALETTE}
              selected={availableColors}
              onChange={setAvailableColors}
            />
            <CheckboxGroup
              label="Talles disponibles"
              options={SIZE_OPTIONS}
              selected={availableSizes}
              onChange={setAvailableSizes}
            />
            <CheckboxGroup
              label="Tamaños de estampa"
              options={STAMP_SIZE_OPTIONS}
              selected={stampSizes}
              onChange={setStampSizes}
            />
            <CheckboxGroup
              label="Ubicaciones de estampa"
              options={STAMP_LOCATION_OPTIONS}
              selected={stampLocations}
              onChange={setStampLocations}
            />
          </div>
        </div>

        {/* Right column — status + actions */}
        <div className="space-y-4">
          <div className="bg-background border border-border p-6 space-y-4">
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
                className={`relative w-10 h-5 transition-colors cursor-pointer ${
                  active ? 'bg-primary' : 'bg-border'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 bg-background shadow-sm transition-transform ${
                    active ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </label>
          </div>

          {/* Summary card */}
          <div className="bg-surface border border-border p-6 space-y-3">
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
                <span className="text-muted-foreground">Estado</span>
                <span className={active ? 'text-primary font-medium' : 'text-muted-foreground'}>
                  {active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 text-xs font-medium tracking-widest uppercase hover:bg-primary-hover transition-colors rounded-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : isEditing ? (
              'Guardar cambios'
            ) : (
              'Crear producto'
            )}
          </button>

          {isEditing && (
            <Link
              href={`/productos/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center border border-border text-muted-foreground hover:text-foreground hover:border-foreground px-6 py-3 text-xs font-medium tracking-widest uppercase transition-colors"
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
