export interface AdminShippingProviderSettings {
  id: string
  provider: string
  customerId: string
  originPostalCode: string
  senderName: string
  senderEmail: string
  senderPhone: string
  senderStreet: string
  senderStreetNumber: string
  senderFloor: string
  senderApartment: string
  senderCity: string
  senderProvinceCode: string
  senderPostalCode: string
  createdAt: Date
  updatedAt: Date
}
