'use client'

import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { formatPrice } from '@/lib/utils/format-price'
import type { ProductCard as ProductCardProps } from '../types'

export function ProductDetailCard({ slug, name, price, imageUrl, category }: ProductCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const accentRef = useRef<HTMLDivElement>(null)
  const gradientRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.set(gradientRef.current, { opacity: 0 })
    gsap.set(ctaRef.current,     { opacity: 0, y: 6 })
    gsap.set(accentRef.current,  { scaleY: 0, transformOrigin: 'bottom center' })
  }, [])

  const animateIn = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    gsap.to(cardRef.current,     { y: -6, duration: 0.28, ease: 'power2.out' })
    gsap.to(imageRef.current,    { scale: 1.05, duration: 0.42, ease: 'power3.out' })
    gsap.to(gradientRef.current, { opacity: 1, duration: 0.35, ease: 'power2.out' })
    gsap.to(ctaRef.current,      { opacity: 1, y: 0, duration: 0.30, ease: 'power2.out', delay: 0.06 })
    gsap.to(accentRef.current,   { scaleY: 1, duration: 0.38, ease: 'power3.out', transformOrigin: 'bottom center' })
  }, [])

  const animateOut = useCallback(() => {
    gsap.to(cardRef.current,     { y: 0, scale: 1, duration: 0.25, ease: 'power2.out' })
    gsap.to(imageRef.current,    { scale: 1, duration: 0.30, ease: 'power2.out' })
    gsap.to(gradientRef.current, { opacity: 0, duration: 0.22, ease: 'power2.in' })
    gsap.to(ctaRef.current,      { opacity: 0, y: 6, duration: 0.18, ease: 'power2.in' })
    gsap.to(accentRef.current,   { scaleY: 0, duration: 0.22, ease: 'power2.in', transformOrigin: 'bottom center' })
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

  return (
    <Link href={`/productos/${slug}`} className="block">
      <article
        ref={cardRef}
        className="group cursor-pointer"
        onMouseEnter={animateIn}
        onMouseLeave={animateOut}
        onFocus={animateIn}
        onBlur={animateOut}
        onMouseDown={animatePress}
        onMouseUp={releasePress}
      >
        <div className="relative aspect-square sm:aspect-[3/4] overflow-hidden bg-surface">
          <Image
            ref={imageRef}
            src={imageUrl}
            alt={`${name} — Fueradecontexto`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Accent line — draws up from bottom on hover */}
          <div
            ref={accentRef}
            className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary pointer-events-none"
          />

          {/* Gradient overlay */}
          <div
            ref={gradientRef}
            className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none product-detail-card-gradient"
          />

          {/* CTA pill */}
          <div
            ref={ctaRef}
            className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-5 pointer-events-none"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-background/90 backdrop-blur-sm text-[10px] font-medium tracking-[0.22em] uppercase text-foreground">
              Ver detalles →
            </span>
          </div>
        </div>

        <div className="pt-4 space-y-1.5">
          <p className="text-2xs font-medium tracking-[0.25em] uppercase text-muted-foreground">
            {category}
          </p>
          <h3 className="text-xl font-normal font-serif leading-snug text-foreground">
            {name}
          </h3>
          <p className="text-base font-medium text-foreground">
            {formatPrice(price)}
          </p>
        </div>
      </article>
    </Link>
  )
}
