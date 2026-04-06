'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { useCart } from '@/features/cart/hooks/use-cart'
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

export function ProductDetailCard({ id, slug, name, price, imageUrl, category }: ProductCardProps) {
  const { addItem, openCart } = useCart()

  const [activeSlide, setActiveSlide] = useState(0)
  const cardRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const sliderTrackRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const slides = useMemo(() => [imageUrl, imageUrl, imageUrl], [imageUrl])
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

  const handleAddToCart = useCallback(() => {
    addItem({
      productId: id,
      productName: name,
      productPrice: price,
      productImageUrl: imageUrl,
      productSlug: slug,
      quantity: 1,
    })
    openCart()
  }, [addItem, id, imageUrl, name, openCart, price, slug])

  return (
    <article
      ref={cardRef}
      className="group cursor-pointer rounded-[1.65rem] border border-border/80 bg-background p-3.5 shadow-[0_16px_40px_rgba(26,26,26,0.08)]"
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
      onFocus={animateIn}
      onBlur={animateOut}
      onMouseDown={animatePress}
      onMouseUp={releasePress}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-surface">
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
          className="absolute left-2.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition hover:bg-background"
        >
          {'<'}
        </button>
        <button
          type="button"
          onClick={goToNextSlide}
          aria-label="Imagen siguiente"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition hover:bg-background"
        >
          {'>'}
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

      <div className="pt-4 space-y-2">
        <Link href={`/productos/${slug}`} className="block">
          <h3 className="text-[2.05rem] font-normal font-serif leading-[1.02] text-foreground line-clamp-2">
            {name}
          </h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium tracking-[0.18em] uppercase text-primary">{category}</span>
            <span className="h-4 w-px bg-border" />
            <span className="line-clamp-1">Nuevo</span>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground line-clamp-2">
            {miniDescription}
          </p>
        </Link>
        <p className="text-[1.65rem] font-semibold text-foreground">{formatPrice(price)}</p>
      </div>

      <button
        ref={buttonRef}
        type="button"
        onClick={handleAddToCart}
        className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold tracking-[0.08em] uppercase text-primary-foreground transition-colors hover:bg-primary-hover"
      >
        <span aria-hidden="true">+</span>
        Anadir al carrito
      </button>
    </article>
  )
}
