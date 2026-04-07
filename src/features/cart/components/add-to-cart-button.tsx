'use client'

import { useCallback, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../hooks/use-cart'

interface AddToCartButtonProps {
  productId: string
  productName: string
  productPrice?: number
  productImageUrl?: string
  productSlug?: string
  quantity?: number
  selectedColor?: string
  selectedSize?: string
  selectedStampSize?: string
  selectedStampLocations?: string[]
}

export function AddToCartButton({
  productId,
  productName,
  productPrice = 0,
  productImageUrl = '',
  productSlug = '',
  quantity = 1,
  selectedColor,
  selectedSize,
  selectedStampSize,
  selectedStampLocations,
}: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const { addItem, openCart } = useCart()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)
  const pulseRef = useRef<HTMLSpanElement>(null)

  const animateAddFeedback = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const button = buttonRef.current
    const icon = iconRef.current
    const pulse = pulseRef.current

    if (!button || !icon || !pulse) {
      return
    }

    gsap.killTweensOf([button, icon, pulse])

    const tl = gsap.timeline({ defaults: { overwrite: 'auto' } })
    tl.to(button, { scale: 0.96, duration: 0.08, ease: 'power2.out' })
      .to(button, { scale: 1.03, duration: 0.15, ease: 'back.out(2.2)' })
      .to(button, { scale: 1, duration: 0.18, ease: 'power2.out' })

    tl.fromTo(
      icon,
      { y: 0, rotate: 0 },
      { y: -2, rotate: -10, duration: 0.1, ease: 'power2.out' },
      0.02,
    ).to(icon, { y: 0, rotate: 0, duration: 0.16, ease: 'power2.out' })

    tl.fromTo(
      pulse,
      { opacity: 0.35, scale: 0.9 },
      { opacity: 0, scale: 1.28, duration: 0.42, ease: 'power2.out' },
      0,
    )
  }, [])

  const animateFlyToCart = useCallback(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const source = buttonRef.current
    const cartTarget = document.querySelector('[data-cart-icon-target="true"]') as HTMLElement | null

    if (!source || !cartTarget) {
      return
    }

    const sourceRect = source.getBoundingClientRect()
    const targetRect = cartTarget.getBoundingClientRect()
    const deltaX = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2)
    const deltaY = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2)
    const drift = deltaX >= 0 ? 18 : -18

    const ghost = document.createElement('span')
    ghost.setAttribute('aria-hidden', 'true')
    ghost.style.position = 'fixed'
    ghost.style.left = `${sourceRect.left + sourceRect.width / 2 - 9}px`
    ghost.style.top = `${sourceRect.top + sourceRect.height / 2 - 9}px`
    ghost.style.width = '20px'
    ghost.style.height = '20px'
    ghost.style.borderRadius = '9999px'
    ghost.style.backgroundColor = 'var(--color-primary)'
    ghost.style.opacity = '1'
    ghost.style.pointerEvents = 'none'
    ghost.style.zIndex = '2147483646'
    ghost.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent), 0 10px 22px color-mix(in srgb, var(--color-primary) 45%, transparent)'
    ghost.style.border = '1px solid rgba(255, 255, 255, 0.4)'
    ghost.style.willChange = 'transform, opacity'

    document.body.appendChild(ghost)

    const tl = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: () => {
        window.dispatchEvent(new CustomEvent('cart:item-added'))
        ghost.remove()
      },
    })

    tl.to(ghost, {
      keyframes: [
        {
          x: deltaX * 0.16 + drift,
          y: deltaY * 0.12 - 72,
          scale: 1.08,
          rotate: drift > 0 ? -12 : 12,
          opacity: 1,
          duration: 0.28,
          ease: 'sine.out',
        },
        {
          x: deltaX * 0.5 - drift * 0.42,
          y: deltaY * 0.48 - 52,
          scale: 0.94,
          rotate: drift > 0 ? 8 : -8,
          opacity: 0.95,
          duration: 0.32,
          ease: 'power1.inOut',
        },
        {
          x: deltaX * 0.82 + drift * 0.24,
          y: deltaY * 0.82 - 18,
          scale: 0.8,
          rotate: drift > 0 ? -5 : 5,
          opacity: 0.72,
          duration: 0.3,
          ease: 'sine.inOut',
        },
        {
          x: deltaX,
          y: deltaY,
          scale: 0.46,
          rotate: 0,
          opacity: 0.18,
          duration: 0.34,
          ease: 'power3.in',
        },
      ],
    })

  }, [])

  async function handleAddToCart() {
    setLoading(true)
    addItem({
      productId,
      productName,
      productPrice,
      productImageUrl,
      productSlug,
      quantity,
      ...(selectedColor !== undefined ? { selectedColor } : {}),
      ...(selectedSize !== undefined ? { selectedSize } : {}),
      ...(selectedStampSize !== undefined ? { selectedStampSize } : {}),
      ...(selectedStampLocations !== undefined && selectedStampLocations.length > 0
        ? { selectedStampLocations }
        : {}),
    })
    animateAddFeedback()
    animateFlyToCart()
    openCart()
    setLoading(false)
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleAddToCart}
      disabled={loading}
      className="relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-none bg-primary px-8 py-4 text-sm font-medium tracking-widest uppercase text-primary-foreground transition-[background-color,transform] hover:bg-primary-hover disabled:opacity-50"
    >
      <span
        ref={pulseRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-none border border-primary-foreground/35 opacity-0"
      />
      <span ref={iconRef} className="relative z-10 inline-flex">
        <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
      </span>
      {loading ? 'Agregando...' : 'Agregar al carrito'}
    </button>
  )
}
