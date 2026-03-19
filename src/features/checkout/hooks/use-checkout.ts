'use client'

import { useReducer } from 'react'
import type { CheckoutAction, CheckoutState, ContactData, ShippingData, StepId } from '../types'

const initialState: CheckoutState = {
  step: 1,
  contactData: null,
  shippingData: null,
  orderId: null,
}

function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'SET_CONTACT':
      return { ...state, step: 2, contactData: action.data }
    case 'SET_SHIPPING':
      return { ...state, step: 3, shippingData: action.data }
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

  function advanceContact(data: ContactData) {
    dispatch({ type: 'SET_CONTACT', data })
  }

  function advanceShipping(data: ShippingData) {
    dispatch({ type: 'SET_SHIPPING', data })
  }

  function prevStep() {
    dispatch({ type: 'PREV_STEP' })
  }

  function setOrderId(orderId: string) {
    dispatch({ type: 'SET_ORDER_ID', orderId })
  }

  return { state, advanceContact, advanceShipping, prevStep, setOrderId }
}
