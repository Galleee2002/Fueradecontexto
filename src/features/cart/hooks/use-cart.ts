'use client'

import { useCartStore } from '../store/cart-store'
import { formatPrice } from '@/shared/lib/format-price'

export function useCart() {
  const store = useCartStore()

  return {
    items: store.items,
    isOpen: store.isOpen,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    openCart: store.openCart,
    closeCart: store.closeCart,
    totalItems: store.totalItems(),
    totalPrice: store.totalPrice(),
    formattedTotal: formatPrice(store.totalPrice()),
    isEmpty: store.items.length === 0,
  }
}
