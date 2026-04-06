'use client'

import { useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { formatPrice } from '@/lib/utils/format-price'
import type { ProductCard as ProductCardProps } from '../types'

export function ProductCard({ slug, name, price, imageUrl, category }: ProductCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const animateIn = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -6,
        duration: 0.28,
        ease: 'power2.out',
      })
    }

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1.05,
        duration: 0.42,
        ease: 'power3.out',
      })
    }
  }, [])

  const animateOut = useCallback(() => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        duration: 0.25,
        ease: 'power2.out',
      })
    }

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }, [])

  const animatePress = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    if (!cardRef.current) return

    gsap.to(cardRef.current, {
      scale: 0.985,
      duration: 0.12,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }, [])

  const releasePress = useCallback(() => {
    if (!cardRef.current) return

    gsap.to(cardRef.current, {
      scale: 1,
      duration: 0.16,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }, [])

  return (
    <Link href={`/productos/${slug}`}>
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
        <div className="relative aspect-[3/4] overflow-hidden bg-surface">
          <Image
            ref={imageRef}
            src={imageUrl}
            alt={`${name} — Fueradecontexto`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <div className="pt-4 space-y-1">
          <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            {category}
          </p>
          <h3 className="text-base font-medium text-foreground leading-snug">
            {name}
          </h3>
          <p className="text-xl font-semibold text-foreground">
            {formatPrice(price)}
          </p>
        </div>
      </article>
    </Link>
  )
}
