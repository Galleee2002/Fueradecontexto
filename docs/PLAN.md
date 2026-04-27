# PLAN — Fueradecontexto

> Guía de implementación completa. Complementa `DESIGN.md`, que sigue siendo la fuente de verdad para todas las decisiones de diseño, estilos y convenciones.
>
> **Actualizado:** 2026-03-19

---

## Índice

1. [Overview — Mapa de rutas](#1-overview--mapa-de-rutas)
2. [Fase 0: Fundación global](#2-fase-0-fundación-global) ✅
3. [Fase 1: Home](#3-fase-1-home) ✅
4. [Fase 2: Productos (listado)](#4-fase-2-productos-listado) ✅
5. [Fase 3: Detalle del producto](#5-fase-3-detalle-del-producto) ✅
6. [Fase 4: Quiénes somos](#6-fase-4-quiénes-somos) ✅
7. [Fase 5: Checkout](#7-fase-5-checkout) ✅
8. [Fase 6: Dashboard admin](#8-fase-6-dashboard-admin) ✅
9. [Fase 7: Conexión Frontend ↔ Backend](#9-fase-7-conexión-frontend--backend) ✅
10. [Fase 8: Integración MercadoPago](#10-fase-8-integración-mercadopago)
11. [Fase 9: Deploy en Vercel](#11-fase-9-deploy-en-vercel)
12. [Fase 10: Dominio + Hosting](#12-fase-10-dominio--hosting)
13. [Fase 11: Sistema de correo](#13-fase-11-sistema-de-correo)
14. [Convenciones y referencias](#14-convenciones-y-referencias)

---

## 1. Overview — Mapa de rutas

```
/                          → Home
/productos                 → Listado con filtros
/productos/[slug]          → Detalle de producto
/carrito                   → Carrito (CartDrawer como página)
/cuenta                    → Login / cuenta del usuario
/quienes-somos             → Página institucional
/checkout                  → Flujo multi-step
/checkout/confirmacion     → Orden confirmada
/admin                     → Dashboard admin — redirige a /admin/productos
/admin/productos           → CRUD de productos
/admin/ordenes             → Lista de órdenes
/admin/clientes            → Lista de clientes
```

---

## 10. Fase 8: Integración MercadoPago

Reemplazar el mock de pago con el flujo real de MercadoPago.

### Tareas

- **Instalar SDKs:**
  ```bash
  npm install @mercadopago/sdk-js   # frontend
  npm install mercadopago            # backend
  ```

- **API route — crear preferencia:**
  - Crear `src/app/api/checkout/preference/route.ts` (`POST`)
  - Recibe items del carrito + datos de comprador
  - Llama a `mercadopago.preferences.create()` con los items
  - Retorna `{ preference_id, init_point }`

- **Integrar en UI de pago:**
  - Actualizar `src/features/checkout/components/PaymentStep.tsx`
  - Usar Checkout Pro (redirect) o Bricks (embedded) según decisión de diseño
  - Manejar retorno de MP con `?status=approved|failure|pending`

- **Webhook:**
  - Crear `src/app/api/webhooks/mercadopago/route.ts` (`POST`)
  - Verificar firma con `MP_WEBHOOK_SECRET`
  - En evento `payment.created` con status `approved`: actualizar `order.status = 'paid'` en BD

- **Variables de entorno necesarias:**
  ```
  MP_ACCESS_TOKEN=
  MP_PUBLIC_KEY=
  MP_WEBHOOK_SECRET=
  ```

- **Testing:** Usar credenciales sandbox de MercadoPago antes de pasar a producción

---

## 11. Fase 9: Deploy en Vercel

Primera deploy productiva.

### Tareas

- Conectar repositorio GitHub al proyecto en Vercel
- Configurar variables de entorno en el dashboard de Vercel:
  ```
  DATABASE_URL=          # Neon connection string (producción)
  NEXTAUTH_SECRET=
  NEXTAUTH_URL=
  MP_ACCESS_TOKEN=
  MP_PUBLIC_KEY=
  MP_WEBHOOK_SECRET=
  RESEND_API_KEY=        # o SENDGRID_API_KEY
  EMAIL_FROM=
  ```
- Configurar branch de producción en Neon (separado del branch de desarrollo)
- Ejecutar `prisma migrate deploy` en el pipeline de build (agregar a `package.json` scripts o Vercel build command)
- Habilitar Edge Runtime para rutas críticas si aplica (ej. middleware de auth)
- Primera deploy → smoke test manual de flujo completo: home → producto → carrito → checkout → pago

---

## 12. Fase 10: Dominio + Hosting

Configurar dominio custom.

### Tareas

- Registrar dominio en el proveedor elegido (ej. NIC.ar para `.ar`, Namecheap, o similar)
- En Vercel dashboard: agregar dominio custom al proyecto
- En el proveedor DNS: apuntar el dominio a Vercel
  - Opción A (apex domain): agregar registro `A` apuntando a `76.76.21.21`
  - Opción B (subdominio): agregar registro `CNAME` apuntando a `cname.vercel-dns.com`
- Verificar que Vercel provisione el certificado SSL automáticamente (Let's Encrypt)
- Actualizar `NEXTAUTH_URL` y cualquier callback URL de MP al dominio definitivo

---

## 13. Fase 11: Sistema de correo

Envío de emails transaccionales.

### Tareas

- **Elegir proveedor:** Resend (recomendado — SDK nativo para Next.js) o SendGrid
  ```bash
  npm install resend
  # o
  npm install @sendgrid/mail
  ```

- **Plantillas de email:**
  - `OrderConfirmationEmail` — enviado al cliente tras orden exitosa: resumen de items, total, datos de envío
  - `NewOrderAdminEmail` — enviado al admin: alerta con datos de la nueva orden
  - `PasswordResetEmail` — (futuro) link de reset para auth por credenciales

- **Integración con checkout:**
  - Disparar emails dentro de `createOrder()` (o en un paso posterior via webhook de MP para órdenes pagadas)
  - Usar React Email para las plantillas si se elige Resend

- **Variables de entorno:**
  ```
  RESEND_API_KEY=        # o SENDGRID_API_KEY
  EMAIL_FROM=            # ej. "Fueradecontexto <noreply@fueradecontexto.com.ar>"
  EMAIL_ADMIN=           # destinatario de notificaciones de nuevas órdenes
  ```

- **Archivos a crear:**
  ```
  src/features/checkout/emails/OrderConfirmationEmail.tsx
  src/features/checkout/emails/NewOrderAdminEmail.tsx
  src/features/checkout/actions/send-order-emails.ts
  ```

---

## 14. Convenciones y referencias

- Toda la lógica de negocio vive en `src/features/<feature>/`
- Server actions en `src/features/<feature>/actions/`
- Componentes de UI en `src/features/<feature>/components/`
- Tipos en `src/features/<feature>/types.ts`
- Las rutas de Next.js en `src/app/` son solo puntos de entrada; no contienen lógica
- Ver `DESIGN.md` para decisiones de diseño visual y componentes

---

*Plan actualizado: 2026-03-19 | Complementa DESIGN.md*
