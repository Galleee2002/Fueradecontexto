'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { formatPrice } from '@/shared/lib/format-price'
import type { ProductCard as ProductCardProps } from '../types'

interface ProductDetailCardProps extends ProductCardProps {
  autoSlide?: boolean
  autoSlideDelayMs?: number
}

function buildMiniDescription(name: string, category: string): string {
  const cleanName = name.replace(/\|/g, ' ').replace(/\s+/g, ' ').trim()
  const base = `Pieza de ${category.toLowerCase()} con diseño contemporaneo y terminaciones cuidadas para uso diario.`

  if (cleanName.length <= 48) {
    return `${cleanName}. ${base}`
  }

  return `${cleanName.slice(0, 45)}... ${base}`
}

export function ProductDetailCard({
  id,
  slug,
  name,
  price,
  stock,
  imageUrl,
  images,
  category,
  autoSlide = true,
  autoSlideDelayMs = 3400,
}: ProductDetailCardProps) {
  const [activeSlide, setActiveSlide] = useState(0)
  const cardRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const sliderTrackRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)

  const slides = useMemo(() => {
    const unique = images
      .map((image) => image.url)
      .filter((url, index, array) => url && array.indexOf(url) === index)

    if (unique.length > 0) return unique.slice(0, 4)

    return imageUrl ? [imageUrl] : []
  }, [imageUrl, images])
  const miniDescription = useMemo(() => buildMiniDescription(name, category), [name, category])

  useEffect(() => {
    gsap.set(buttonRef.current, { y: 4 })
  }, [])

  const autoSlideKey = autoSlide ? autoSlideDelayMs : -1

  useEffect(() => {
    if (!autoSlide || slides.length <= 1) return

    const reducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) return

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, autoSlideDelayMs)

    return () => window.clearInterval(interval)
  }, [slides.length, autoSlideKey])

  useEffect(() => {
    const pct = slides.length > 0 ? -(activeSlide * (100 / slides.length)) : 0
    gsap.to(sliderTrackRef.current, {
      xPercent: pct,
      duration: 0.45,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }, [activeSlide, slides.length])

  const animateIn = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    gsap.to(cardRef.current, { y: -6, duration: 0.28, ease: 'power2.out' })
    gsap.to(imageRef.current, { scale: 1.05, duration: 0.42, ease: 'power3.out' })
    gsap.to(buttonRef.current, { y: 0, duration: 0.3, ease: 'power2.out' })
  }, [])

  const animateOut = useCallback(() => {
    gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.25, ease: 'power2.out' })
    gsap.to(imageRef.current, { scale: 1, duration: 0.3, ease: 'power2.out' })
    gsap.to(buttonRef.current, { y: 4, duration: 0.2, ease: 'power2.out' })
  }, [])

  const animatePress = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    gsap.to(cardRef.current, { scale: 0.985, duration: 0.12, ease: 'power2.out', overwrite: 'auto' })
  }, [])

  const releasePress = useCallback(() => {
    gsap.to(cardRef.current, { scale: 1, duration: 0.16, ease: 'power2.out', overwrite: 'auto' })
  }, [])

  const goToPreviousSlide = useCallback(() => {
    if (slides.length === 0) return
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goToNextSlide = useCallback(() => {
    if (slides.length === 0) return
    setActiveSlide((current) => (current + 1) % slides.length)
  }, [slides.length])

  return (
    <article
      ref={cardRef}
      className="group flex h-full min-w-0 cursor-pointer flex-col rounded-3xl border border-border/80 bg-background shadow-[0_8px_22px_rgba(20,20,20,0.06)] transition-[box-shadow,border-color] duration-300 hover:border-primary/30 hover:shadow-[0_14px_30px_rgba(20,20,20,0.1)]"
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
      onFocus={animateIn}
      onBlur={animateOut}
      onMouseDown={animatePress}
      onMouseUp={releasePress}
    >
      <div className="relative isolate">
        <div className="relative overflow-hidden rounded-t-3xl bg-surface">
          <Link href={`/productos/${slug}`} className="block min-w-0 max-w-full">
            <div ref={sliderTrackRef} className="relative z-0 flex w-full min-w-0">
              {slides.map((slide, index) => (
                <div key={`${slide}-${index}`} className="relative aspect-[3/4] w-full min-w-0 shrink-0">
                  <Image
                    ref={index === activeSlide ? imageRef : null}
                    src={slide}
                    alt={`${name} — Fueradecontexto`}
                    fill
                    className="object-contain object-center sm:object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
                </div>
              ))}
            </div>
          </Link>

          <div className="pointer-events-none absolute inset-x-3 top-3 z-[1] flex items-center justify-between gap-2">
            <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-foreground">
              {category}
            </span>
            {stock <= 0 && (
              <span className="rounded-full border border-foreground/25 bg-background px-2.5 py-1 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-foreground">
                Sin stock
              </span>
            )}
          </div>

          {slides.length > 1 && (
            <div className="absolute inset-x-0 bottom-3 z-[1] flex justify-center gap-1.5">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Ir a imagen ${index + 1}`}
                  className={
                    index === activeSlide
                      ? 'h-1.5 w-5 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]'
                      : 'h-1.5 w-1.5 rounded-full bg-white/70'
                  }
                />
              ))}
            </div>
          )}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPreviousSlide}
              aria-label="Imagen anterior"
              className="absolute left-1.5 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-base leading-none text-foreground opacity-100 shadow-sm transition-all duration-200 hover:bg-surface sm:left-3 sm:h-8 sm:w-8 sm:opacity-0 sm:text-[0.8rem] sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              {'‹'}
            </button>
            <button
              type="button"
              onClick={goToNextSlide}
              aria-label="Imagen siguiente"
              className="absolute right-1.5 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-base leading-none text-foreground opacity-100 shadow-sm transition-all duration-200 hover:bg-surface sm:right-3 sm:h-8 sm:w-8 sm:opacity-0 sm:text-[0.8rem] sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              {'›'}
            </button>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col space-y-4 rounded-b-3xl px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
        <Link href={`/productos/${slug}`} className="block min-w-0">
          <h3 className="text-[1.05rem] font-medium leading-tight tracking-[-0.02em] text-foreground line-clamp-2 sm:text-[1.22rem]">
            {name}
          </h3>
          <p className="mt-2 text-[0.85rem] leading-relaxed text-muted-foreground line-clamp-3 sm:text-[0.88rem] sm:line-clamp-2">
            {miniDescription}
          </p>
        </Link>

        <div className="mt-auto flex flex-col gap-2 border-t border-border/60 pt-3 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <p className="text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">Precio</p>
            <p className="mt-1 text-[1.28rem] font-semibold tracking-tight text-primary sm:text-[1.42rem]">
              {formatPrice(price)}
            </p>
          </div>
          <p className="text-[0.7rem] leading-snug text-foreground/65 sm:max-w-[11rem] sm:text-right sm:text-xs">
            Envio a todo el pais
          </p>
        </div>
      </div>

      <Link
        ref={buttonRef}
        href={`/productos/${slug}`}
        className="mx-4 mb-4 mt-1 inline-flex min-h-[44px] w-[calc(100%-2rem)] max-w-full items-center justify-center rounded-xl border border-neutral-900 bg-neutral-900 px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white transition-[background-color,border-color,color,transform] duration-300 hover:border-blue-700 hover:bg-blue-700 sm:mx-5 sm:mb-5 sm:w-[calc(100%-2.5rem)]"
      >
        Ver detalle
      </Link>
    </article>
  )
}
