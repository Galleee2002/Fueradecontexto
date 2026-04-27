# Codebase Structure

> Reference rápido. No editar a mano — actualizar cuando cambie la arquitectura.

---

## Tech Stack

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js App Router | 16.2 |
| Lenguaje | TypeScript strict | 5.9 |
| Estilos | Tailwind CSS v4 + PostCSS | 4.2 |
| Componentes UI | shadcn/ui | v4 |
| Base de datos | Neon Serverless Postgres | — |
| ORM | Prisma | 7.5 |
| Estado cliente | Zustand | 5.0 |
| Validación | Zod | 4.3 |
| Iconos | Lucide React | 0.577 |
| Fuentes | Cormorant Garamond + Inter | next/font/google |

---

## Árbol de directorios

```
src/
├── app/
│   ├── layout.tsx               # Root layout (fuentes, globals.css)
│   ├── globals.css              # Tailwind v4 + design tokens
│   ├── (site)/                  # Route group — rutas públicas
│   │   ├── layout.tsx           # Navbar + Footer
│   │   ├── page.tsx             # Home /
│   │   ├── carrito/page.tsx     # Carrito
│   │   ├── cuenta/page.tsx      # Login / cuenta
│   │   ├── productos/
│   │   │   ├── page.tsx         # Listado con filtros
│   │   │   └── [slug]/page.tsx  # Detalle de producto
│   │   ├── quienes-somos/page.tsx
│   │   └── checkout/
│   │       ├── page.tsx
│   │       └── confirmacion/page.tsx
│   └── admin/                   # Rutas protegidas
│       ├── layout.tsx           # Sidebar admin
│       ├── page.tsx             # Redirect → /admin/productos
│       ├── productos/           # CRUD productos
│       │   ├── page.tsx
│       │   ├── nuevo/page.tsx
│       │   └── [id]/page.tsx
│       ├── ordenes/page.tsx
│       └── clientes/page.tsx
│
├── features/                    # Arquitectura feature-first
│   ├── home/
│   │   ├── components/          # hero-section, featured-products, categories-grid, services-strip
│   │   ├── queries/home-queries.ts
│   │   └── types.ts
│   ├── products/
│   │   ├── components/          # product-card, product-grid, product-detail, product-image-gallery,
│   │   │                        # product-filters, product-pagination, color-selector, related-products
│   │   ├── queries/product-queries.ts
│   │   ├── actions/product-actions.ts
│   │   ├── hooks/use-product-filters.ts
│   │   ├── schemas/product-schema.ts
│   │   └── types.ts
│   ├── cart/
│   │   ├── components/          # cart-drawer, cart-item, add-to-cart-button, cart-icon
│   │   ├── store/cart-store.ts  # Zustand store
│   │   ├── hooks/use-cart.ts
│   │   ├── actions/cart-actions.ts
│   │   └── types.ts
│   ├── checkout/
│   │   ├── components/          # checkout-steps, step-contact, step-shipping, step-payment, order-summary
│   │   ├── hooks/use-checkout.ts
│   │   ├── actions/checkout-actions.ts
│   │   └── types.ts
│   ├── navigation/
│   │   ├── components/          # navbar, footer, mobile-menu, search-bar, cart-icon
│   │   └── types.ts
│   ├── auth/
│   │   ├── components/          # login-form, user-menu
│   │   ├── actions/auth-actions.ts
│   │   └── types.ts
│   ├── admin/
│   │   ├── components/          # admin-sidebar, admin-header, product-form, products-table,
│   │   │                        # delete-product-button, toggle-active-button, product-search,
│   │   │                        # admin-pagination, stats-card
│   │   ├── queries/admin-queries.ts
│   │   ├── actions/product-actions.ts
│   │   └── types.ts
│   └── about/
│       ├── components/          # hero-about, manifiesto-section, valores-section, equipo-section
│       └── types.ts
│
├── components/
│   ├── shared/
│   │   ├── layout/              # container.tsx, page-header.tsx, section.tsx
│   │   └── feedback/            # empty-state.tsx, loading-skeleton.tsx
│   └── ui/                      # shadcn/ui (auto-generado, no editar)
│
├── lib/
│   ├── db/
│   │   ├── client.ts            # Neon serverless client
│   │   └── prisma.ts            # Prisma client (singleton)
│   ├── constants/site.ts        # SITE_NAME, límites globales
│   └── utils/
│       ├── cn.ts                # clsx + tailwind-merge
│       ├── format-price.ts
│       └── format-date.ts
│
└── types/
    ├── index.ts                 # Re-exports
    └── database.ts              # Tipos de modelos DB

prisma/
└── schema.prisma                # Modelos: Product, CartItem

generated/                       # Output de Prisma — NO editar

docs/
├── ../DESIGN.md                 # Design system — fuente de verdad
├── PLAN.md                      # Roadmap de implementación por fases
├── DATOS.md                     # Referencia de datos
└── CODEBASE.md                  # Este archivo
```

---

## Modelos de base de datos (Prisma)

```prisma
Product         // id, slug, name, description, price, imageUrl, category, active, timestamps
  └── CartItem  // id, productId, quantity, sessionId
```

Modelos futuros (Fase 5–6): `Order`, `OrderItem`, `Customer`

---

## Convenciones clave

| Regla | Detalle |
|---|---|
| Path alias | `@/*` → `src/*` |
| Server Components | Por defecto. `"use client"` solo cuando sea necesario |
| Queries DB | Solo en Server Components o Server Actions |
| Imágenes | Siempre `next/image`, nunca `<img>` |
| Estilos | Tokens semánticos de `globals.css`, nunca hex hardcodeado |
| Bordes | `rounded-none` siempre en botones y cards |
| Espaciado | Grid de 8px (xs=4, sm=8, md=16, lg=24, xl=32, 2xl=48, 3xl=64, 4xl=96) |
| Colores | 60% neutros / 30% crema-off-white / 10% fucsia `#E91E8C` |
| Tipografía | Cormorant Garamond en headings, Inter en UI |
| UI lib | Solo shadcn/ui — ninguna otra |
| TypeScript | `strict: true` obligatorio |

---

## Fases de implementación (PLAN.md)

| Fase | Contenido | Estado |
|---|---|---|
| 0 | Foundation: Navbar, Footer, Mobile Menu | Pendiente |
| 1 | Home page | Componentes creados |
| 2 | Listado de productos con filtros | Componentes creados |
| 3 | Detalle de producto + galería | Componentes creados |
| 4 | Quiénes somos (estática) | Componentes creados |
| 5 | Checkout multi-paso | Scaffolded |
| 6 | Admin dashboard | Scaffolded |

---

## Archivos de configuración raíz

| Archivo | Propósito |
|---|---|
| `next.config.ts` | Remote image patterns (todos los hosts HTTPS) |
| `tsconfig.json` | Strict, path alias `@/*`, excluye `generated/` |
| `postcss.config.mjs` | Plugin Tailwind v4 |
| `prisma.config.ts` | Neon adapter para Prisma CLI |
| `.env` | `DATABASE_URL` y otros secrets (no en repo) |
