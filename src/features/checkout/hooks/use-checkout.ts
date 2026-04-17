'use client'

import { useCallback, useReducer } from 'react'
import type { CheckoutAction, CheckoutState, ContactData, ShippingData, ShippingQuote, StepId } from '../types'

const initialState: CheckoutState = {
  step: 1,
  contactData: null,
  shippingData: null,
  shippingQuote: null,
  orderId: null,
}

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'SET_CONTACT':
      return { ...state, step: 2, contactData: action.data }
    case 'SET_SHIPPING':
      return { ...state, step: 3, shippingData: action.data, shippingQuote: null }
    case 'SET_SHIPPING_QUOTE':
      return { ...state, shippingQuote: action.data }
    case 'CLEAR_SHIPPING_QUOTE':
      return { ...state, shippingQuote: null }
    case 'PREV_STEP':
      return { ...state, step: (Math.max(1, state.step - 1)) as StepId }
    case 'SET_ORDER_ID':
      return { ...state, orderId: action.orderId }
    default:
      return state
  }
}

export function useCheckout() {
  const [state, dispatch] = useReducer(checkoutReducer, initialState)

  const advanceContact = useCallback((data: ContactData) => {
    dispatch({ type: 'SET_CONTACT', data })
  }, [])

  const advanceShipping = useCallback((data: ShippingData) => {
    dispatch({ type: 'SET_SHIPPING', data })
  }, [])

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' })
  }, [])

  const setShippingQuote = useCallback((data: ShippingQuote) => {
    dispatch({ type: 'SET_SHIPPING_QUOTE', data })
  }, [])

  const clearShippingQuote = useCallback(() => {
    dispatch({ type: 'CLEAR_SHIPPING_QUOTE' })
  }, [])

  const setOrderId = useCallback((orderId: string) => {
    dispatch({ type: 'SET_ORDER_ID', orderId })
  }, [])

  return { state, advanceContact, advanceShipping, prevStep, setOrderId, setShippingQuote, clearShippingQuote }
}
