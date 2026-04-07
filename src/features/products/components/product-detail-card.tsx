'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { formatPrice } from '@/lib/utils/format-price'
import type { ProductCard as ProductCardProps } from '../types'

function buildMiniDescription(name: string, category: string): string {
  const cleanName = name.replace(/\|/g, ' ').replace(/\s+/g, ' ').trim()
  const base = `Pieza de ${category.toLowerCase()} con diseño contemporaneo y terminaciones cuidadas para uso diario.`

  if (cleanName.length <= 48) {
    return `${cleanName}. ${base}`
  }

  return `${cleanName.slice(0, 45)}... ${base}`
}

export function ProductDetailCard({ id, slug, name, price, imageUrl, previewImages, category }: ProductCardProps) {
  const [activeSlide, setActiveSlide] = useState(0)
  const cardRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const sliderTrackRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)

  const slides = useMemo(() => {
    const unique = [imageUrl, ...previewImages].filter((url, index, array) => url && array.indexOf(url) === index)
    return unique.slice(0, 4)
  }, [imageUrl, previewImages])
  const miniDescription = useMemo(() => buildMiniDescription(name, category), [name, category])

  useEffect(() => {
    gsap.set(buttonRef.current, { y: 4 })
  }, [])

  useEffect(() => {
    const reducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) return

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 3400)

    return () => window.clearInterval(interval)
  }, [slides.length])

  useEffect(() => {
    gsap.to(sliderTrackRef.current, {
      xPercent: -(activeSlide * 100),
      duration: 0.45,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }, [activeSlide])

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
    setActiveSlide((current) => (current - 1 + slides.length) % slides.length)
  }, [slides.length])

  const goToNextSlide = useCallback(() => {
    setActiveSlide((current) => (current + 1) % slides.length)
  }, [slides.length])

  return (
    <article
      ref={cardRef}
      className="group cursor-pointer rounded-2xl border border-border/80 bg-background p-3 shadow-[0_10px_26px_rgba(26,26,26,0.08)]"
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
      onFocus={animateIn}
      onBlur={animateOut}
      onMouseDown={animatePress}
      onMouseUp={releasePress}
    >
      <div className="relative overflow-hidden rounded-xl border border-border/70 bg-surface">
        <Link href={`/productos/${slug}`} className="block">
          <div ref={sliderTrackRef} className="flex">
            {slides.map((slide, index) => (
              <div key={`${slide}-${index}`} className="relative aspect-square w-full shrink-0">
                <Image
                  ref={index === activeSlide ? imageRef : null}
                  src={slide}
                  alt={`${name} — Fueradecontexto`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            ))}
          </div>
        </Link>

        <button
          type="button"
          onClick={goToPreviousSlide}
          aria-label="Imagen anterior"
          className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full border border-border/70 bg-background/80 text-[0.7rem] text-foreground shadow-sm backdrop-blur-sm transition hover:bg-background"
        >
          {'‹'}
        </button>
        <button
          type="button"
          onClick={goToNextSlide}
          aria-label="Imagen siguiente"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full border border-border/70 bg-background/80 text-[0.7rem] text-foreground shadow-sm backdrop-blur-sm transition hover:bg-background"
        >
          {'›'}
        </button>

        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Ir a imagen ${index + 1}`}
              className={
                index === activeSlide
                  ? 'h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_2px_rgba(255,255,255,0.75)]'
                  : 'h-2.5 w-2.5 rounded-full bg-background/75'
              }
            />
          ))}
        </div>
      </div>

      <div className="space-y-3 px-1 pb-1 pt-4">
        <Link href={`/productos/${slug}`} className="block">
          <div className="mb-2.5 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
            <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-1 font-medium text-primary">{category}</span>
            <span className="h-3.5 w-px bg-border" />
            <span>Nuevo</span>
          </div>
          <h3 className="text-[1.35rem] font-medium font-serif leading-[1.1] text-foreground line-clamp-2">
            {name}
          </h3>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-muted-foreground line-clamp-2">
            {miniDescription}
          </p>
        </Link>

        <div className="border-t border-border/70 pt-3">
          <p className="text-[1.5rem] font-semibold tracking-tight text-foreground">{formatPrice(price)}</p>
        </div>
      </div>

      <Link
        ref={buttonRef}
        href={`/productos/${slug}`}
        className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[0.78rem] font-semibold tracking-[0.08em] uppercase text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        Ver producto
      </Link>
    </article>
  )
}
