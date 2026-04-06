'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItemUI } from '../types'
import { MAX_CART_ITEMS } from '@/lib/constants/site'

interface CartStore {
  items: CartItemUI[]
  isOpen: boolean
  addItem: (item: Omit<CartItemUI, 'id' | 'variantKey'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const variantKey = [
          item.productId,
          item.selectedColor ?? '',
          item.selectedSize ?? '',
          item.selectedStampSize ?? '',
           (item.selectedStampLocations ?? []).join(';'),
        ].join('|')
        set((state) => {
          const existing = state.items.find((i) => i.variantKey === variantKey)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantKey === variantKey
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, MAX_CART_ITEMS) }
                  : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              { ...item, id: crypto.randomUUID(), variantKey, quantity: Math.min(item.quantity, MAX_CART_ITEMS) },
            ],
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id
              ? { ...i, quantity: Math.min(quantity, MAX_CART_ITEMS) }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0),
    }),
    { name: 'fueradecontexto-cart' }
  )
)
