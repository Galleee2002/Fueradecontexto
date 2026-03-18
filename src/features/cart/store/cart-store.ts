'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItemUI } from '../types'
import { MAX_CART_ITEMS } from '@/lib/constants/site'

interface CartStore {
  items: CartItemUI[]
  isOpen: boolean
  addItem: (item: Omit<CartItemUI, 'id'>) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
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
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, MAX_CART_ITEMS) }
                  : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              { ...item, id: crypto.randomUUID(), quantity: Math.min(item.quantity, MAX_CART_ITEMS) },
            ],
          }
        })
      },

      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
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
