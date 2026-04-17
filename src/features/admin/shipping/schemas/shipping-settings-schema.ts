import { z } from 'zod'
import { normalizeCorreoArgentinoCustomerId } from '@/shared/infrastructure/shipping/correo-argentino/utils'

const correoPostalCodeSchema = z
  .string()
  .trim()
  .regex(/^(\d{4}|[A-Za-z]\d{4}[A-Za-z]{0,3})$/, 'Ingresá un código postal válido, por ejemplo 1414 o C1414ABC')

export const shippingProviderSettingsSchema = z.object({
  customerId: z
    .string()
    .trim()
    .min(1, 'El customerId es requerido')
    .refine((value) => /^\d+$/.test(value), 'El customerId debe contener solo dígitos')
    .refine((value) => value.length <= 10, 'El customerId no puede superar los 10 dígitos')
    .transform((value) => normalizeCorreoArgentinoCustomerId(value)),
  originPostalCode: correoPostalCodeSchema,
  senderName: z.string().trim().min(1, 'El nombre del remitente es requerido'),
  senderEmail: z.string().trim().email('El email del remitente es inválido'),
  senderPhone: z.string().trim().min(6, 'El teléfono del remitente es requerido'),
  senderStreet: z.string().trim().min(1, 'La calle del remitente es requerida'),
  senderStreetNumber: z.string().trim().min(1, 'La altura del remitente es requerida'),
  senderFloor: z.string().trim().max(20).default(''),
  senderApartment: z.string().trim().max(20).default(''),
  senderCity: z.string().trim().min(1, 'La ciudad del remitente es requerida'),
  senderProvinceCode: z
    .string()
    .trim()
    .length(1, 'El código de provincia debe tener 1 carácter')
    .regex(/^[A-Z]$/, 'El código de provincia debe ser una letra mayúscula'),
  senderPostalCode: correoPostalCodeSchema,
})

export type ShippingProviderSettingsInput = z.infer<typeof shippingProviderSettingsSchema>
