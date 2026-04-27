# DATOS.md — Contrato de Estructura de Datos

> **FUENTE DE VERDAD DE DATOS.** Este documento define cómo los datos fluyen desde PostgreSQL hasta el cliente en Fueradecontexto. Todo nuevo modelo, campo o transformación debe ser documentado aquí primero. Los tipos en código son la implementación; este documento es el contrato.

*Última actualización: 2026-03-18 | Stack: Next.js 16 · Prisma 7 · Zod 4 · Zustand 5 · Neon*

---

## 1. Propósito y alcance

Este documento cubre:
- El **contrato por capa** de cada modelo de datos (DB → tipos → UI → cliente)
- Las **reglas de validación** que se aplican en cada capa
- Las **invariantes de negocio** que el código debe garantizar
- Los **antipatrones prohibidos** que generan vulnerabilidades o inconsistencias
- Los **modelos futuros** planificados con suficiente detalle para implementarse sin ambigüedad

No cubre: esquemas CSS, convenciones de componentes, ni configuración de infraestructura.

---

## 2. Capas del modelo de datos

El sistema tiene exactamente **5 capas**. Los datos solo fluyen hacia adelante. Ninguna capa conoce los detalles internos de la capa anterior.

```
Capa 1 │ DB (PostgreSQL via Neon)
       │  Tablas con nombres entre comillas dobles: "Product", "CartItem"
       │  Tipos nativos: TEXT, NUMERIC(10,2), BOOLEAN, TIMESTAMPTZ
       ▼
Capa 2 │ Prisma types (generated/prisma/models.ts)
       │  Generados automáticamente por Prisma 7
       │  price: Decimal (objeto, no número primitivo)
       │  Usados SOLO para typing, nunca para queries directas
       ▼
Capa 3 │ Server/Query types (src/types/database.ts)
       │  Re-exportan los tipos de Prisma
       │  Añaden relaciones compuestas: ProductWithCartItems, CartItemWithProduct
       │  Son los tipos de los resultados raw de las queries SQL
       ▼
Capa 4 │ UI types (src/features/*/types.ts)
       │  Subconjunto seguro de campos para el frontend
       │  price siempre como number (primitivo, ya convertido)
       │  Sin campos internos (sessionId, active, timestamps de sistema)
       ▼
Capa 5 │ Client state (Zustand store, src/features/cart/store.ts)
       │  Estado en memoria del navegador, persistido en localStorage
       │  Clave: "fueradecontexto-cart"
       │  Solo campos necesarios para renderizar la UI del carrito
```

### Regla de flujo

Los datos de precio **siempre se convierten** de `Decimal` (Prisma) a `number` (primitivo) en la **Capa 3→4**, dentro de Server Components o Server Actions, nunca en el cliente.

---

## 3. Convenciones de nombrado

### Tablas PostgreSQL

Las tablas usan **PascalCase entre comillas dobles** — convención forzada por Prisma 7:

```sql
SELECT * FROM "Product"  -- correcto
SELECT * FROM product    -- incorrecto: no existe sin comillas
SELECT * FROM products   -- incorrecto: nombre diferente
```

### Campos en DB vs TypeScript

| DB (snake_case implícito via Prisma) | TypeScript (camelCase) |
|---|---|
| `imageUrl` (TEXT) | `imageUrl: string` |
| `productId` (TEXT) | `productId: string` |
| `sessionId` (TEXT) | `sessionId: string` |
| `createdAt` (TIMESTAMPTZ) | `createdAt: Date` |
| `updatedAt` (TIMESTAMPTZ) | `updatedAt: Date` |
| `price` (NUMERIC 10,2) | Capa 2-3: `Decimal` / Capa 4+: `number` |

### Tipos TypeScript

| Sufijo | Significado | Ejemplo |
|---|---|---|
| `Model` | Tipo Prisma generado (Capa 2) | `ProductModel` |
| `With*` | Tipo con relación incluida (Capa 3) | `CartItemWithProduct` |
| `UI` | Tipo para el frontend (Capa 4) | `CartItemUI` |
| `State` | Tipo del store Zustand (Capa 5) | `CartState` |
| `Input` | Datos de entrada validados con Zod | `ProductInput` |
| `Filters` | Parámetros de búsqueda/filtrado | `ProductFiltersInput` |

---

## 4. Modelos actuales

### 4.1 Product

#### Capa 1 — DB (`"Product"`)

```
id          TEXT          PK, CUID
slug        TEXT          UNIQUE, NOT NULL
name        TEXT          NOT NULL
description TEXT          NULL
price       NUMERIC(10,2) NOT NULL, > 0
imageUrl    TEXT          NOT NULL
category    TEXT          NOT NULL
active      BOOLEAN       DEFAULT true, NOT NULL
createdAt   TIMESTAMPTZ   DEFAULT now()
updatedAt   TIMESTAMPTZ   auto-updated
```

#### Capa 2 — Prisma type (`ProductModel`)

Generado en `generated/prisma/models.ts`. Tipo resultante:

```ts
interface ProductModel {
  id: string
  slug: string
  name: string
  description: string | null
  price: Decimal          // objeto Prisma, NO number primitivo
  imageUrl: string
  category: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}
```

**Atención:** `price` es `Decimal` de `@prisma/client/runtime/library`. Llamar `.toNumber()` para convertirlo.

#### Capa 3 — Server/Query types (`src/types/database.ts`)

```ts
// Re-exportados tal como llegan de Prisma
export type { ProductModel, CartItemModel }

// Con relaciones (uso en queries JOIN)
export type ProductWithCartItems = ProductModel & {
  cartItems?: CartItemModel[]
}
```

#### Capa 4 — UI types (`src/features/products/types.ts`)

```ts
// Vista de tarjeta: mínimo para renderizar el listado
export interface ProductCard {
  id: string
  slug: string
  name: string
  price: number        // convertido desde Decimal en Server Component
  imageUrl: string
  category: string
  // SIN: description, active, createdAt, updatedAt
}

// Vista completa: para la página de detalle
export interface ProductFull extends ProductCard {
  description: string | null
  active: boolean
  createdAt: Date
  updatedAt: Date
  // SIN: cartItems (relación interna)
}

// Filtros de búsqueda (input del usuario)
export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}
```

**Conversión obligatoria** en Server Component antes de pasar props:

```ts
// En el Server Component que consulta productos
const products: ProductCard[] = rawRows.map(row => ({
  ...row,
  price: Number(row.price),   // Decimal → number
}))
```

#### Capa 5 — Client state

`Product` no tiene estado propio en el cliente. Solo sus datos viajan como parte de `CartItemUI` (ver modelo CartItem).

#### Zod schema — Validación de entrada (`src/features/products/schemas/product-schema.ts`)

Usado para validar datos al **crear o editar** un producto (ej. formulario de administración):

```ts
export const productSchema = z.object({
  slug:        z.string().min(1).regex(/^[a-z0-9-]+$/),
  name:        z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  price:       z.number().positive(),
  imageUrl:    z.string().url(),
  category:    z.string().min(1),
  active:      z.boolean().default(true),
})

export type ProductInput = z.infer<typeof productSchema>
```

También existe `productFiltersSchema` para validar los parámetros de filtrado recibidos en query strings.

#### Gaps de validación identificados

- No existe Zod schema para **leer** productos (output validation). Riesgo: si la DB retorna datos corruptos, llegan al frontend sin detección.
- `productFiltersSchema` no valida que `minPrice <= maxPrice`.

---

### 4.2 CartItem

#### Capa 1 — DB (`"CartItem"`)

```
id        TEXT  PK, CUID
productId TEXT  FK → "Product".id, NOT NULL
quantity  INT   DEFAULT 1, NOT NULL, > 0
sessionId TEXT  NOT NULL  ← identifica la sesión anónima del usuario
```

**Invariante de negocio:** Un `sessionId` puede tener múltiples `CartItem`, uno por `productId`.

#### Capa 2 — Prisma type (`CartItemModel`)

```ts
interface CartItemModel {
  id: string
  productId: string
  quantity: number
  sessionId: string
  product?: ProductModel   // relación eager opcional
}
```

#### Capa 3 — Server/Query types (`src/types/database.ts`)

```ts
export type CartItemWithProduct = CartItemModel & {
  product: ProductModel    // relación requerida en este tipo
}
```

#### Capa 4 — UI types (`src/features/cart/types.ts`)

```ts
export interface CartItemUI {
  id: string
  productId: string
  productName: string
  productPrice: number     // convertido desde Decimal en Server
  productImageUrl: string
  productSlug: string
  quantity: number
  // SIN: sessionId (campo interno, nunca exponer al cliente)
}
```

**`sessionId` NUNCA debe aparecer en `CartItemUI` ni en ningún tipo de Capa 4 o 5.**

#### Capa 5 — Client state (`src/features/cart/types.ts`, store Zustand)

```ts
export interface CartState {
  items: CartItemUI[]
  isOpen: boolean
  // Acciones (definidas en el store, no en este tipo):
  //   addItem(item: CartItemUI): void
  //   removeItem(id: string): void
  //   updateQuantity(id: string, quantity: number): void
  //   clearCart(): void
}
```

Persistido en `localStorage` bajo la clave `"fueradecontexto-cart"`.

#### Gaps de validación identificados

- **No existe Zod schema** para validar `CartItem` al agregar al carrito. El `productId` y `quantity` que llegan a la Server Action no son validados formalmente.
- **No existe validación de `quantity > 0`** a nivel de schema (solo el default en DB).
- **`sessionId`** se genera en el servidor pero no hay schema que defina su formato esperado.

---

## 5. Modelos planificados

### 5.1 User

Referenciado en `src/features/auth/types.ts`. La feature `auth` ya está scaffolded.

#### Contrato esperado por capa

**Capa 1 — DB (`"User"`)**
```
id           TEXT          PK, CUID
email        TEXT          UNIQUE, NOT NULL
passwordHash TEXT          NOT NULL  ← NUNCA exponer en ninguna capa UI
name         TEXT          NULL
createdAt    TIMESTAMPTZ   DEFAULT now()
updatedAt    TIMESTAMPTZ   auto-updated
```

**Capa 2 — Prisma type (`UserModel`)**
```ts
interface UserModel {
  id: string
  email: string
  passwordHash: string    // solo en Capas 1-2, nunca pasar a Capa 3+
  name: string | null
  createdAt: Date
  updatedAt: Date
}
```

**Capa 3 — Server/Query type**
```ts
// Al hacer SELECT, NUNCA incluir passwordHash en la proyección
export type UserPublic = Omit<UserModel, 'passwordHash'>
```

**Capa 4 — UI type (`src/features/auth/types.ts`)**
```ts
export interface AuthUser {
  id: string
  email: string
  name: string | null
  // SIN: passwordHash, createdAt, updatedAt
}
```

**Capa 5 — Client state**
```ts
interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  // SIN: tokens de sesión en localStorage (manejar con cookies HttpOnly)
}
```

**Inputs de autenticación (`src/features/auth/types.ts`)**
```ts
export interface LoginInput {
  email: string
  password: string    // se valida con Zod, se usa para comparar hash, nunca se persiste
}
```

**Zod schemas necesarios (pendientes de implementar)**
```ts
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().min(1).max(100).optional(),
})
```

**Invariantes de seguridad:**
- `passwordHash` nunca debe aparecer en tipos de Capa 3 o superior
- Las sesiones se manejan con **cookies HttpOnly**, no con localStorage
- El token de sesión nunca llega al estado Zustand

---

### 5.2 Order

Modelo del checkout flow (Fase 5 del PLAN.md).

#### Contrato esperado por capa

**Capa 1 — DB (`"Order"`)**
```
id          TEXT          PK, CUID
userId      TEXT          FK → "User".id, NULL (permite órdenes de invitados)
sessionId   TEXT          NULL (para órdenes de invitados sin cuenta)
total       NUMERIC(10,2) NOT NULL, > 0  ← calculado en servidor, NUNCA desde cliente
status      TEXT          CHECK IN ('pending','paid','shipped','delivered','cancelled')
createdAt   TIMESTAMPTZ   DEFAULT now()
updatedAt   TIMESTAMPTZ   auto-updated
```

**Capa 2 — Prisma type (`OrderModel`)**
```ts
interface OrderModel {
  id: string
  userId: string | null
  sessionId: string | null
  total: Decimal
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}
```

**Capa 3 — Server/Query types**
```ts
export type OrderWithItems = OrderModel & {
  items: OrderItemWithProduct[]
}
```

**Capa 4 — UI types**
```ts
export interface OrderUI {
  id: string
  total: number           // convertido desde Decimal
  status: OrderStatus     // tipo string union
  createdAt: Date
  items: OrderItemUI[]
  // SIN: userId, sessionId (datos internos)
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
```

**Capa 5 — Client state**

`Order` no tiene estado persistido en el cliente. Solo se muestra en páginas de confirmación/historial, que son Server Components.

**Invariante crítica:** El campo `total` se **calcula siempre en el servidor** sumando los precios actuales de los productos desde la DB. Nunca se acepta un `total` enviado desde el cliente.

---

### 5.3 OrderItem

Línea de detalle dentro de una `Order`.

#### Contrato esperado por capa

**Capa 1 — DB (`"OrderItem"`)**
```
id          TEXT          PK, CUID
orderId     TEXT          FK → "Order".id, NOT NULL
productId   TEXT          FK → "Product".id, NOT NULL
quantity    INT           NOT NULL, > 0
unitPrice   NUMERIC(10,2) NOT NULL  ← snapshot del precio al momento de la compra
```

**Nota:** `unitPrice` es un **snapshot** — captura el precio en el momento de la compra. No se actualiza si el producto cambia de precio después.

**Capa 2 — Prisma type (`OrderItemModel`)**
```ts
interface OrderItemModel {
  id: string
  orderId: string
  productId: string
  quantity: number
  unitPrice: Decimal
}
```

**Capa 3 — Server/Query type**
```ts
export type OrderItemWithProduct = OrderItemModel & {
  product: ProductModel
}
```

**Capa 4 — UI type**
```ts
export interface OrderItemUI {
  id: string
  productId: string
  productName: string
  productSlug: string
  productImageUrl: string
  quantity: number
  unitPrice: number       // convertido desde Decimal, precio al momento de compra
  subtotal: number        // quantity * unitPrice, calculado al mapear
  // SIN: orderId (contexto implícito)
}
```

**Capa 5 — Client state**

`OrderItem` no tiene estado en cliente. Solo se renderiza en páginas de confirmación/historial (Server Components).

---

## 6. Flujo de datos

### 6.1 Listado de productos (lectura)

```
1. Usuario navega a /productos
2. Server Component (page.tsx) ejecuta query SQL contra "Product"
3. Resultado: ProductModel[] (price como Decimal)
4. Server Component mapea → ProductCard[] (price como number via .toNumber())
5. Se pasan como props a componentes hijos (Server Components)
6. Client Components solo reciben ProductCard, nunca ProductModel
```

### 6.2 Agregar al carrito

```
1. Usuario hace click en "Agregar al carrito" (Client Component)
2. Se invoca Server Action con { productId, quantity }
3. Server Action valida input con Zod (pendiente de implementar)
4. Server Action lee el precio actual del producto desde DB (NUNCA usa precio del cliente)
5. Server Action lee/genera sessionId desde la cookie de sesión
6. INSERT en "CartItem" con { productId, quantity, sessionId }
7. Server Action retorna CartItemUI (con precio de DB)
8. Store Zustand actualiza estado local con el CartItemUI retornado
```

### 6.3 Checkout (flujo planificado)

```
1. Usuario confirma carrito (Client Component con CartState)
2. Se invoca Server Action de checkout con { sessionId }
3. Server Action lee los CartItem del sessionId desde DB
4. Para cada CartItem, lee el precio actual del producto desde DB
5. Calcula total en servidor (suma de quantity * price por cada item)
6. Crea Order con total calculado + status 'pending'
7. Crea OrderItem[] con snapshot de precio actual (unitPrice)
8. Limpia CartItem del sessionId
9. Retorna { orderId } al cliente para redirigir a confirmación
10. Página de confirmación (Server Component) lee Order + OrderItems desde DB
```

---

## 7. Reglas de validación por capa

| Capa | Qué validar | Herramienta | Estado |
|---|---|---|---|
| Capa 1 (DB) | Tipos, constraints, NOT NULL, CHECK | PostgreSQL nativo | Implementado |
| Capa 2 (Prisma) | Tipos TypeScript, nullabilidad | Prisma type generation | Implementado |
| Capa 3 (Server) | Que la query retorna los campos esperados | TypeScript estricto | Implementado |
| Capa 4 (UI) | Input del usuario (formularios, query strings) | Zod 4 | Parcial — solo productos |
| Capa 4 (UI) | Input de Server Actions (carrito, checkout) | Zod 4 | **Pendiente** |
| Capa 5 (Client) | Estado del store antes de enviar a servidor | TypeScript + Zod | Parcial |

### Qué validar en Capa 4 (Server Actions)

Toda Server Action que recibe datos del cliente DEBE validar con Zod antes de cualquier operación de DB:

```ts
// Ejemplo: addToCart
const cartInputSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().positive().max(99),
})

export async function addToCart(input: unknown) {
  const { productId, quantity } = cartInputSchema.parse(input)
  // recién aquí operar con DB
}
```

### Qué NO validar con Zod

- El output de queries SQL (confiar en los tipos TypeScript de Prisma es suficiente)
- Los props entre Server Components (TypeScript los garantiza en build time)
- El estado interno del store Zustand (no llega al servidor directamente)

---

## 8. Seguridad y consistencia

### 8.1 Precio siempre desde DB

**Regla:** El precio de un producto para cualquier cálculo monetario (total de orden, subtotal) se lee **siempre desde la base de datos** en el momento de la operación.

**Por qué:** El precio visible en el carrito del cliente puede ser stale (viejo) o manipulado. Aceptar el precio del cliente como válido es una vulnerabilidad crítica de e-commerce.

**Cómo aplicar:**
- `CartItemUI.productPrice` es solo para **mostrar** en la UI
- Nunca usar `CartItemUI.productPrice` como input de una Server Action de checkout
- En la Server Action de checkout: `SELECT price FROM "Product" WHERE id = $productId`

### 8.2 sessionId nunca expuesta en UI types

**Regla:** `CartItem.sessionId` identifica la sesión del usuario anónimo. Es un dato interno del servidor.

**Por qué:** Exponer `sessionId` en el cliente permitiría a un atacante acceder o manipular carritos de otros usuarios si intercepta el valor.

**Cómo aplicar:**
- `CartItemUI` no tiene campo `sessionId` — correcto, mantenerlo así
- `sessionId` se lee/genera en el servidor desde cookies firmadas
- Nunca incluir `sessionId` en ningún tipo de Capa 4 o 5

### 8.3 passwordHash nunca en tipos UI

**Regla:** `User.passwordHash` no debe aparecer en ningún tipo de Capa 3 o superior.

**Cómo aplicar:**
- Al hacer SELECT de un usuario, **siempre proyectar campos explícitamente** (no `SELECT *`)
- Usar `UserPublic = Omit<UserModel, 'passwordHash'>` como tipo de Capa 3
- `AuthUser` (Capa 4) no tiene `passwordHash` — correcto, mantenerlo así

### 8.4 No campos sensibles en Client state

**Regla:** El store Zustand no debe contener:
- `sessionId` de carrito
- Tokens de autenticación o sesión
- `passwordHash` o cualquier dato de credenciales
- IDs de base de datos internos que el cliente no necesita renderizar

**Cómo aplicar:**
- Los tokens de sesión de autenticación van en **cookies HttpOnly** (inaccesibles desde JS)
- El store Zustand persiste en localStorage: asumir que cualquier dato ahí es legible por el usuario y por scripts de terceros

---

## 9. Invariantes de negocio

Estas reglas describen condiciones que el sistema debe garantizar en todo momento:

| # | Invariante | Capa que la garantiza |
|---|---|---|
| 1 | Un producto con `active = false` nunca aparece en listados públicos | Capa 1 (WHERE active = true en queries) |
| 2 | `price` de un producto es siempre > 0 | Capa 1 (CHECK constraint) + Capa 4 (Zod positive) |
| 3 | `slug` de un producto es único globalmente | Capa 1 (UNIQUE constraint) |
| 4 | `CartItem.quantity` es siempre ≥ 1 | Capa 1 (DEFAULT 1) — **falta CHECK > 0** |
| 5 | El total de una Order se calcula en servidor con precios actuales de DB | Capa 3 (Server Action de checkout) |
| 6 | `OrderItem.unitPrice` es el precio al momento de la compra (snapshot inmutable) | Capa 1 (columna separada, no FK a precio actual) |
| 7 | Un usuario no puede ver ni modificar el carrito de otra sesión | Capa 3 (Server Action filtra por sessionId de cookie propia) |
| 8 | `sessionId` se genera y valida solo en el servidor | Capa 3 (Server Action/middleware) |

---

## 10. Antipatrones prohibidos

### AP-1: Precio desde el cliente

```ts
// PROHIBIDO
export async function checkout(cartItems: CartItemUI[]) {
  const total = cartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0)
  // ← precio viene del cliente, puede estar manipulado
}

// CORRECTO
export async function checkout(sessionId: string) {
  const items = await sql`
    SELECT ci.quantity, p.price
    FROM "CartItem" ci
    JOIN "Product" p ON p.id = ci."productId"
    WHERE ci."sessionId" = ${sessionId}
  `
  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
}
```

### AP-2: SELECT * en queries de usuario

```ts
// PROHIBIDO — expone passwordHash y otros campos internos
const user = await sql`SELECT * FROM "User" WHERE id = ${userId}`

// CORRECTO — proyección explícita
const user = await sql`
  SELECT id, email, name FROM "User" WHERE id = ${userId}
`
```

### AP-3: Decimal sin convertir en props de componente

```ts
// PROHIBIDO — Decimal no es serializable como prop de Server Component
<ProductCard price={product.price} />  // product.price es Decimal

// CORRECTO
<ProductCard price={Number(product.price)} />
```

### AP-4: sessionId en CartItemUI

```ts
// PROHIBIDO
export interface CartItemUI {
  sessionId: string  // ← campo interno, no debe estar aquí
}

// CORRECTO — sessionId no existe en CartItemUI
export interface CartItemUI {
  id: string
  productId: string
  // ... sin sessionId
}
```

### AP-5: Query en Client Component

```ts
// PROHIBIDO — expone credenciales de DB al bundle del cliente
'use client'
import { sql } from '@/lib/db'  // ← ERROR: no funciona en cliente + vulnerabilidad

// CORRECTO — query solo en Server Component o Server Action
// page.tsx (Server Component por defecto)
const products = await sql`SELECT ... FROM "Product"`
```

### AP-6: Zod schema sin uso real

```ts
// PROHIBIDO — definir schema pero no parsearlo
export async function addToCart(productId: string, quantity: number) {
  // cartInputSchema existe pero no se usa aquí
  await sql`INSERT INTO "CartItem" ...`
}

// CORRECTO — siempre parsear el input antes de operar
export async function addToCart(input: unknown) {
  const { productId, quantity } = cartInputSchema.parse(input)
  await sql`INSERT INTO "CartItem" ...`
}
```

### AP-7: Tipo `any` en datos de DB

```ts
// PROHIBIDO
const rows: any[] = await sql`SELECT ...`
const product = rows[0]  // sin tipos, sin seguridad

// CORRECTO
const rows = await sql`SELECT id, name, price FROM "Product" WHERE slug = ${slug}`
const product = rows[0] as ProductModel  // o mejor: mapear a ProductCard explícitamente
```

---

*Para convenciones de UI, paleta de colores y componentes, ver `DESIGN.md`.*
*Para el roadmap de features y fases, ver `docs/PLAN.md`.*
