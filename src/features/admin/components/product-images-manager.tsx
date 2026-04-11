'use client'

import Image from 'next/image'
import { ArrowLeft, ArrowRight, ImageOff, Loader2, Star, Trash2, Upload } from 'lucide-react'
import type { ProductColor, ProductImage } from '@/entities/product'

interface ProductImagesManagerProps {
  images: ProductImage[]
  availableColors: ProductColor[]
  isUploading: boolean
  uploadError: string
  validationError?: string | undefined
  clearedAssignments: number
  onUpload: (file: File) => Promise<void>
  onImagesChange: (images: ProductImage[]) => void
}

export function ProductImagesManager({
  images,
  availableColors,
  isUploading,
  uploadError,
  validationError,
  clearedAssignments,
  onUpload,
  onImagesChange,
}: ProductImagesManagerProps) {
  function updateImage(index: number, nextImage: ProductImage) {
    onImagesChange(images.map((image, imageIndex) => (imageIndex === index ? nextImage : image)))
  }

  function removeImage(index: number) {
    onImagesChange(images.filter((_, imageIndex) => imageIndex !== index))
  }

  function moveImage(index: number, direction: -1 | 1) {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= images.length) return

    const nextImages = [...images]
    const [currentImage] = nextImages.splice(index, 1)
    if (!currentImage) return
    nextImages.splice(nextIndex, 0, currentImage)
    onImagesChange(nextImages)
  }

  return (
    <div className="bg-background border border-border p-6 space-y-5">
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-2xs font-medium tracking-widest uppercase text-muted-foreground">
            Galería del producto
          </p>
          <p className="text-sm text-muted-foreground">
            Cargá todas las imágenes de la prenda y vinculá cada una a un color del producto o dejala general.
          </p>
        </div>

        <label className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 border border-border px-4 py-2.5 text-xs font-medium tracking-widest uppercase text-muted-foreground transition-colors hover:border-foreground hover:text-foreground">
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Agregar imagen
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) void onUpload(file)
              event.currentTarget.value = ''
            }}
          />
        </label>
      </div>

      {validationError && (
        <div className="border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
          {validationError}
        </div>
      )}

      {uploadError && (
        <div className="border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
          {uploadError}
        </div>
      )}

      {clearedAssignments > 0 && (
        <div className="border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
          {clearedAssignments === 1
            ? 'Se limpió 1 vínculo de color porque ese color ya no está seleccionado en el producto.'
            : `Se limpiaron ${clearedAssignments} vínculos de color porque esos colores ya no están seleccionados en el producto.`}
        </div>
      )}

      {images.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 border border-dashed border-border bg-surface/60 px-6 text-center">
          <ImageOff className="h-10 w-10 text-muted-foreground/50" strokeWidth={1.25} />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Todavía no hay imágenes cargadas.</p>
            <p className="text-sm text-muted-foreground">
              Sumá al menos una imagen para definir la portada del producto.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
          {images.map((image, index) => {
            const linkedColor = availableColors.find((color) => color.name === image.colorName)

            return (
              <div
                key={`${image.url}-${index}`}
                className="grid gap-5 border border-border bg-surface/40 p-4 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-start"
              >
                <div className="space-y-3">
                  <div className="relative aspect-[3/4] overflow-hidden border border-border bg-background lg:min-h-[240px]">
                    <Image
                      src={image.url}
                      alt={image.colorName ? `Imagen de ${image.colorName}` : `Imagen general ${index + 1}`}
                      fill
                      sizes="(min-width: 1024px) 180px, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex min-h-[32px] items-center gap-1 border border-border bg-background px-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground">
                      <Star className="h-3.5 w-3.5 text-primary" />
                      {index === 0 ? 'Portada' : `Orden ${index + 1}`}
                    </span>

                    {linkedColor ? (
                      <span className="inline-flex min-h-[32px] items-center gap-2 border border-border bg-background px-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground">
                        <span
                          className="h-3.5 w-3.5 border border-border/60"
                          style={{ backgroundColor: linkedColor.hex }}
                          aria-hidden="true"
                        />
                        {linkedColor.name}
                      </span>
                    ) : (
                      <span className="inline-flex min-h-[32px] items-center border border-dashed border-border px-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        General
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex h-full flex-col justify-between gap-5">
                  <div className="max-w-xl space-y-2">
                    <label className="text-2xs font-medium tracking-widest uppercase text-muted-foreground">
                      Color vinculado
                    </label>
                    <select
                      value={image.colorName ?? ''}
                      onChange={(event) =>
                        updateImage(index, {
                          ...image,
                          colorName: event.target.value || null,
                        })
                      }
                      className="min-h-[44px] w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Sin color / general</option>
                      {availableColors.map((color) => (
                        <option key={color.name} value={color.name}>
                          {color.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Si no seleccionás color, la imagen se usa como fallback general.
                    </p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => moveImage(index, -1)}
                      disabled={index === 0}
                      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 border border-border px-3 py-2 text-xs font-medium tracking-widest uppercase text-muted-foreground transition-colors hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Subir
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, 1)}
                      disabled={index === images.length - 1}
                      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 border border-border px-3 py-2 text-xs font-medium tracking-widest uppercase text-muted-foreground transition-colors hover:border-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Bajar
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 border border-border px-3 py-2 text-xs font-medium tracking-widest uppercase text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
