'use client'

import { useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { formatPrice } from '@/shared/lib/format-price'
import type { ProductCard as ProductCardProps } from '../types'

export function ProductCard({ slug, name, price, stock, imageUrl, category }: ProductCardProps) {
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
    <Link
      href={`/productos/${slug}`}
      className="block h-full rounded-[1.35rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <article
        ref={cardRef}
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.35rem] border border-border/80 bg-surface shadow-[0_14px_40px_rgba(18,24,32,0.05)] transition-[border-color,box-shadow] duration-300 hover:border-foreground/20 hover:shadow-[0_18px_44px_rgba(18,24,32,0.09)]"
        onMouseEnter={animateIn}
        onMouseLeave={animateOut}
        onFocus={animateIn}
        onBlur={animateOut}
        onMouseDown={animatePress}
        onMouseUp={releasePress}
      >
        <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-background/40">
          <Image
            ref={imageRef}
            src={imageUrl}
            alt={`${name} — Fueradecontexto`}
            fill
            className="object-contain object-center sm:object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <div className="flex min-h-0 flex-1 flex-col space-y-2 border-t border-border/70 px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {category}
            </p>
            {stock <= 0 && (
              <span className="rounded-full border border-error-border bg-error-subtle px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-error-foreground">
                Sin stock
              </span>
            )}
          </div>
          <h3 className="text-lg font-medium leading-snug text-foreground">{name}</h3>
          <p className="mt-auto text-xl font-semibold tracking-[-0.03em] text-foreground">{formatPrice(price)}</p>
        </div>
      </article>
    </Link>
  )
}
