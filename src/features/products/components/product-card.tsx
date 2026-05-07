'use client'

import { useCallback, useMemo, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { formatPrice } from '@/shared/lib/format-price'
import type { ProductCard as ProductCardProps } from '../types'

function plainDescriptionText(raw: string | null): string {
  if (!raw) return ''
  return raw
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function cardDescriptionPreview(description: string | null, category: string): string {
  const plain = plainDescriptionText(description)
  if (plain.length > 0) return plain
  return `Pieza de ${category.toLowerCase()} con diseño contemporáneo y buena calidad.`
}

export function ProductCard({ slug, name, description, price, stock, imageUrl, category }: ProductCardProps) {
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

  const descriptionPreview = useMemo(
    () => cardDescriptionPreview(description, category),
    [description, category],
  )

  return (
    <Link
      href={`/productos/${slug}`}
      className="block h-full rounded-[1.35rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <article
        ref={cardRef}
        className="group flex h-full min-h-0 cursor-pointer flex-col overflow-hidden rounded-[1.35rem] border border-border/80 bg-surface shadow-[0_14px_40px_rgba(18,24,32,0.05)] transition-[border-color,box-shadow] duration-300 hover:border-foreground/20 hover:shadow-[0_18px_44px_rgba(18,24,32,0.09)]"
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
        <div className="flex min-h-0 flex-1 flex-col gap-3 border-t border-border/70 px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-5">
          {stock <= 0 && (
            <span className="w-fit shrink-0 rounded-full border border-error-border bg-error-subtle px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-error-foreground">
              Sin stock
            </span>
          )}
          <div className="flex min-h-[10.5rem] flex-1 flex-col gap-3 sm:min-h-[11rem]">
            <h3 className="line-clamp-2 min-h-[2.625rem] text-[0.95rem] font-semibold leading-snug tracking-[-0.02em] text-foreground sm:min-h-[2.75rem] sm:text-base">
              {name}
            </h3>
            <p className="line-clamp-2 min-h-[2.75rem] text-[0.8125rem] leading-relaxed text-muted-foreground sm:text-sm">
              {descriptionPreview}
            </p>
            <p className="text-left text-[1.0625rem] font-semibold tracking-[-0.03em] text-foreground tabular-nums sm:text-lg">
              {formatPrice(price)}
            </p>
            <div className="flex w-full justify-center">
              <span className="inline-flex min-h-9 w-full max-w-[11.5rem] items-center justify-center rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-accent-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-[background-color,transform,box-shadow] duration-200 group-hover:bg-accent-hover group-hover:shadow-[0_2px_8px_rgba(0,102,204,0.28)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 sm:min-h-10 sm:px-4 sm:text-sm">
                Ver producto
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
