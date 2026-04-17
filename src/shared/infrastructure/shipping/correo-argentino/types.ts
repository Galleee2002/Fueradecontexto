export interface CorreoArgentinoTokenResponse {
  token: string
  expires?: string
  expire?: string
}

export interface CorreoArgentinoApiError {
  code?: string
  message?: string
  error?: string
  date?: string
}

export interface CorreoArgentinoRatesRequest {
  customerId: string
  postalCodeOrigin: string
  postalCodeDestination: string
  deliveredType?: 'D' | 'S'
  dimensions: {
    weight: number
    height: number
    width: number
    length: number
  }
}

export interface CorreoArgentinoRate {
  deliveredType: 'D' | 'S'
  productType: string
  productName: string
  price: number
  deliveryTimeMin: string
  deliveryTimeMax: string
}

export interface CorreoArgentinoRatesResponse {
  customerId: string
  validTo: string | null
  rates: CorreoArgentinoRate[]
}

export interface CorreoArgentinoShippingImportRequest {
  customerId: string
  extOrderId: string
  orderNumber: string
  sender: {
    name: string | null
    phone: string | null
    cellPhone: string | null
    email: string | null
    originAddress: {
      streetName: string | null
      streetNumber: string | null
      floor: string | null
      apartment: string | null
      city: string | null
      provinceCode: string | null
      postalCode: string | null
    }
  }
  recipient: {
    name: string
    phone: string | null
    cellPhone: string | null
    email: string
  }
  shipping: {
    deliveryType: 'D'
    agency: null
    address: {
      streetName: string
      streetNumber: string
      floor: string
      apartment: string
      city: string
      provinceCode: string
      postalCode: string
    }
    productType: string
    weight: number
    declaredValue: number
    height: number
    length: number
    width: number
  }
}

export interface CorreoArgentinoShippingImportResponse {
  createdAt: string
}

export interface CorreoArgentinoTrackingEvent {
  event: string
  date: string
  branch: string
  status: string
  sign: string
}

export interface CorreoArgentinoTrackingResponse {
  id: string | null
  productId: string | null
  trackingNumber: string | null
  events: CorreoArgentinoTrackingEvent[]
}
