# PLAN DE FRONTEND — Fueradecontexto

> Guía de implementación del frontend completo. Complementa `SYSTEM_DESIGN.md`, que sigue siendo la fuente de verdad para todas las decisiones de diseño, estilos y convenciones.
>
> **Estado:** 2026-03-18

---

## Índice

1. [Overview — Mapa de rutas](#1-overview--mapa-de-rutas)
2. [Fase 0: Fundación global](#2-fase-0-fundación-global)
3. [Fase 1: Home](#3-fase-1-home)
4. [Fase 2: Productos (listado)](#4-fase-2-productos-listado)
5. [Fase 3: Detalle del producto](#5-fase-3-detalle-del-producto)
6. [Fase 4: Quiénes somos](#6-fase-4-quiénes-somos)
7. [Fase 5: Checkout](#7-fase-5-checkout)
8. [Fase 6: Dashboard admin](#8-fase-6-dashboard-admin)
9. [Convenciones y referencias](#9-convenciones-y-referencias)

---

## 1. Overview — Mapa de rutas

```
/                          → Home
/productos                 → Listado con filtros
/productos/[slug]          → Detalle de producto
/carrito                   → Carrito (CartDrawer como página)
/cuenta                    → Login / cuenta del usuario
/quienes-somos             → Página institucional (NUEVA)
/checkout                  → Flujo multi-step (NUEVO)
/checkout/confirmacion     → Orden confirmada (NUEVO)
/admin                     → Dashboard admin — redirige a /admin/productos (NUEVO)
/admin/productos           → CRUD de productos (NUEVO)
/admin/ordenes             → Lista de órdenes (NUEVO)
/admin/clientes            → Lista de clientes (NUEVO)
```

---


## 6. Fase 4: Quiénes somos

**Archivo a crear:** `src/app/quienes-somos/page.tsx`
**Componentes a crear:** `src/features/about/components/`
**Estado:** No existe.

### 6.1 Estructura de la página

```
/quienes-somos
├── HeroAbout         → imagen full-width + título editorial
├── ManifiestoSection → texto largo, serif, amplio espacio en blanco
├── ValoresSection    → 3 pilares con ícono + texto corto
└── EquipoSection     → (opcional) fotos del equipo en grid
```

### 6.2 Diseño de secciones

#### HeroAbout
```tsx
<section className="relative h-[60vh] overflow-hidden">
  <Image src="/about/hero.webp" fill className="object-cover" alt="..." />
  <div className="absolute inset-0 bg-foreground/40 flex items-end pb-16">
    <Container>
      <h1 className="text-7xl font-light font-serif text-background">
        Fuera de contexto.
      </h1>
    </Container>
  </div>
</section>
```

#### ManifiestoSection
- Fondo `bg-background`, padding `py-24`
- Texto en columna centrada: `max-w-2xl mx-auto`
- Heading `text-4xl font-normal font-serif` + body `text-lg leading-relaxed`
- Sin distracciones visuales — espacio en blanco como protagonista

#### ValoresSection
- Grid `grid-cols-1 md:grid-cols-3 gap-12`
- Cada valor: ícono Lucide (20px, stroke-1.5) + título H3 serif + párrafo breve
- Fondo `bg-surface` para contrastar con sección anterior

### 6.3 Checklist de calidad

- [ ] Server Component (no hay interactividad)
- [ ] Metadata específica: `title: "Quiénes somos — Fueradecontexto"`
- [ ] Imágenes con `next/image`, `sizes` correcto
- [ ] Link desde Navbar ("Quiénes somos") apunta a `/quienes-somos`

---

## 7. Fase 5: Checkout

**Archivo a crear:** `src/app/checkout/page.tsx`
**Archivos a crear:**
```
src/features/checkout/
├── components/
│   ├── checkout-steps.tsx        → indicador de progreso
│   ├── step-contact.tsx          → datos de contacto
│   ├── step-shipping.tsx         → dirección de envío
│   ├── step-payment.tsx          → método de pago
│   └── order-summary.tsx         → resumen del carrito (sidebar)
├── hooks/
│   └── use-checkout.ts           → estado global del flujo
└── types.ts                      → CheckoutFormData, StepId
```
**Estado:** No existe.

### 7.1 Flujo de 3 pasos

```
[1. Contacto] → [2. Envío] → [3. Pago] → [Confirmación]
```

| Paso | Campos | Validación |
|---|---|---|
| 1. Contacto | Email, nombre, apellido, teléfono | Email válido, campos requeridos |
| 2. Envío | Calle, número, piso/dpto, ciudad, provincia, CP | Campos requeridos |
| 3. Pago | Número de tarjeta, vencimiento, CVV, nombre en tarjeta | Formato de tarjeta |

### 7.2 Layout del checkout

```
<div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 py-12">
  {/* Columna izquierda — Formulario */}
  <div>
    <CheckoutSteps currentStep={step} />
    {step === 1 && <StepContact />}
    {step === 2 && <StepShipping />}
    {step === 3 && <StepPayment />}
  </div>

  {/* Columna derecha — Resumen */}
  <aside className="bg-surface p-8 h-fit sticky top-24">
    <OrderSummary />
  </aside>
</div>
```

### 7.3 CheckoutSteps (indicador de progreso)

```
○─────●─────○
1     2     3
Contacto Envío Pago
```

- Paso activo: ícono `bg-primary` (fucsia), texto `text-primary`
- Paso completado: ícono `bg-foreground` (negro), ícono check
- Paso pendiente: ícono `border border-border`, texto `text-muted-foreground`
- Línea conectora: `bg-border` (gris) / `bg-foreground` si completado

### 7.4 Página de confirmación

**Archivo a crear:** `src/app/checkout/confirmacion/page.tsx`

```
✓  (ícono grande, negro)
Tu pedido fue confirmado
Número de orden: #FDC-2026-001
Recibirás un email en {email}

[Seguir comprando]   →  /productos
```

### 7.5 State management del checkout

- `use-checkout.ts`: hook con `useReducer` o Zustand slice
- Estado: `{ step, contactData, shippingData, paymentData, orderId }`
- Al avanzar un paso: validar y guardar el estado del formulario actual
- Al confirmar: llamar Server Action `createOrder()` → retorna `orderId`

### 7.6 Checklist de calidad

- [ ] `"use client"` en `checkout/page.tsx` (maneja estado de pasos)
- [ ] Formularios con validación antes de avanzar
- [ ] Inputs: `rounded-none border-border focus-visible:ring-primary`
- [ ] Botón "Continuar": `bg-primary rounded-none tracking-widest uppercase`
- [ ] Botón "Volver": `variant="ghost"` con flecha ←
- [ ] OrderSummary muestra items del cart store (Zustand) + total
- [ ] `notFound()` si el cart está vacío al entrar al checkout

---

## 8. Fase 6: Dashboard admin

**Archivos a crear:**
```
src/app/admin/
├── layout.tsx                    → layout del admin (sidebar + header)
├── page.tsx                      → redirect a /admin/productos
├── productos/
│   ├── page.tsx                  → listado de productos
│   ├── nuevo/page.tsx            → crear producto
│   └── [id]/page.tsx             → editar producto
├── ordenes/
│   └── page.tsx                  → listado de órdenes
└── clientes/
    └── page.tsx                  → listado de clientes

src/features/admin/
├── components/
│   ├── admin-sidebar.tsx         → navegación lateral del admin
│   ├── admin-header.tsx          → header con usuario + logout
│   ├── product-form.tsx          → formulario crear/editar producto
│   ├── products-table.tsx        → tabla de productos con acciones
│   ├── orders-table.tsx          → tabla de órdenes
│   └── stats-card.tsx            → tarjeta de métrica (total ventas, etc.)
└── actions/
    ├── product-actions.ts        → createProduct, updateProduct, deleteProduct
    └── order-actions.ts          → updateOrderStatus
```

### 8.1 Layout del admin

```
┌──────────────────────────────────────────────────────────────┐
│  ADMIN  ·  Fueradecontexto                    [Usuario ▼]    │  ← AdminHeader
├────────────┬─────────────────────────────────────────────────┤
│            │                                                  │
│  Productos │   <contenido de la ruta activa>                 │
│  Órdenes   │                                                  │
│  Clientes  │                                                  │
│            │                                                  │
└────────────┴─────────────────────────────────────────────────┘
AdminSidebar (w-56, bg-surface, border-r)
```

### 8.2 Protección de rutas

```tsx
// src/app/admin/layout.tsx
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'   // implementar según auth stack

export default async function AdminLayout({ children }) {
  const session = await getSession()
  if (!session?.user?.isAdmin) redirect('/cuenta')
  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <AdminHeader user={session.user} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
```

### 8.3 Vista: Listado de productos (`/admin/productos`)

Tabla con columnas:
| Columna | Tipo | Acciones |
|---|---|---|
| Imagen | thumbnail 40×40 | — |
| Nombre | texto + link a detalle | — |
| Categoría | badge | — |
| Precio | `$XX.XXX` | — |
| Stock | número | — |
| Estado | Activo / Inactivo | toggle |
| Acciones | — | Editar / Eliminar |

- Botón "Nuevo producto" → `/admin/productos/nuevo` (fucsia, `rounded-none`)
- Búsqueda en tiempo real por nombre (Client Component con debounce)
- Paginación: 20 productos por página

### 8.4 Vista: Formulario de producto (`/admin/productos/nuevo` y `/admin/productos/[id]`)

Campos del formulario:
```
Nombre             [input]
Slug               [input — auto-generado desde nombre]
Descripción        [textarea]
Precio             [input number]
Categoría          [select]
Imágenes           [file upload — múltiple]
Stock              [input number]
Activo             [checkbox / switch]
```

- Server Action `createProduct` / `updateProduct` con revalidación de `/productos`
- Validación antes de submit
- Redirect a `/admin/productos` tras éxito con toast de confirmación

### 8.5 Vista: Órdenes (`/admin/ordenes`)

Tabla con columnas: N° Orden, Fecha, Cliente, Total, Estado, Acciones.

Estados posibles: `pendiente` → `procesando` → `enviado` → `entregado` / `cancelado`

- Cambio de estado desde la tabla (select inline)
- Filtro por estado

### 8.6 Diseño del sidebar admin

```tsx
// Paleta del admin: fondo surface, texto foreground, active item con bg-primary/10 + text-primary
const ADMIN_LINKS = [
  { label: 'Productos', href: '/admin/productos', icon: Package },
  { label: 'Órdenes', href: '/admin/ordenes', icon: ShoppingBag },
  { label: 'Clientes', href: '/admin/clientes', icon: Users },
]
```

- Link activo: `bg-primary/10 text-primary font-medium` (fondo fucsia tenue, texto fucsia)
- Link inactivo: `text-muted-foreground hover:text-foreground hover:bg-surface`
- Usa `usePathname()` para detectar ruta activa → Client Component

### 8.7 Checklist de calidad

- [ ] Layout del admin separado del layout raíz (no hereda Navbar/Footer público)
- [ ] Protección de ruta en `admin/layout.tsx` (server-side redirect)
- [ ] Tablas con `shadcn/ui Table` — respetar `rounded-none`
- [ ] Todas las acciones CRUD son Server Actions en `src/features/admin/actions/`
- [ ] No exponer lógica de admin en Client Components
- [ ] Responsive básico: sidebar colapsable en mobile

---

## 9. Convenciones y referencias

### Referencia al SYSTEM_DESIGN.md

> **`docs/SYSTEM_DESIGN.md` es la fuente de verdad.**
> Antes de implementar cualquier componente, verificar:
> - Paleta de colores y tokens semánticos (Sección 2)
> - Tipografía y escala (Sección 3)
> - Layout y espaciado con sistema de 8px (Sección 4)
> - Especificaciones de botones, cards e inputs (Sección 5)
> - Reglas de `next/image` e iconografía (Sección 6)
> - Convenciones de nomenclatura y estructura de carpetas (Sección 8)
> - Las 10 Reglas de Oro (Sección 9)

### Orden de implementación recomendado

```
Fase 0 (Fundación)     → Footer + MobileMenu + Nav update
Fase 4 (Quiénes somos) → Página simple, sin lógica
Fase 1 (Home)          → Revisar/refinar lo existente
Fase 2 (Productos)     → Revisar/refinar lo existente
Fase 3 (Detalle)       → Revisar/refinar lo existente
Fase 5 (Checkout)      → Flujo más complejo, requiere cart funcional
Fase 6 (Admin)         → Último, depende de todo lo anterior
```

### Feature flags a considerar

| Feature | Fase | Condición |
|---|---|---|
| Checkout real (pagos) | Fase 5 | Integrar Stripe/MP cuando el flujo de UI esté listo |
| Auth de admin | Fase 6 | Implementar NextAuth o similar antes del admin |
| Email de confirmación | Fase 5 | Resend o similar — post-MVP |

### Archivos de referencia en el proyecto

| Archivo | Rol |
|---|---|
| `src/app/layout.tsx` | Root layout — agregar Footer aquí |
| `src/lib/constants/site.ts` | `SITE_NAME` y constantes globales |
| `src/components/shared/layout/container.tsx` | `<Container>` para centrar contenido |
| `src/components/shared/layout/page-header.tsx` | Header de página con título y breadcrumb |
| `src/components/shared/feedback/empty-state.tsx` | Estado vacío reutilizable |
| `src/components/shared/feedback/loading-skeleton.tsx` | Skeleton de carga |
| `src/features/cart/components/cart-drawer.tsx` | Drawer del carrito (también página `/carrito`) |
| `src/features/auth/components/login-form.tsx` | Formulario de login en `/cuenta` |

---

*Plan generado: 2026-03-18 | Complementa docs/SYSTEM_DESIGN.md*
