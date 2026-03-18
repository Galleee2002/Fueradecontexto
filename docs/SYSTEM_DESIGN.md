# SYSTEM DESIGN — Fueradecontexto

> **FUENTE DE VERDAD ÚNICA.** Este documento define las reglas absolutas del proyecto. Claude y cualquier agente de IA DEBE leer y respetar estrictamente estas especificaciones antes de generar cualquier código, componente o decisión de diseño. No hay excepciones.

---

## 1. Identidad de Marca

| Atributo | Valor |
|---|---|
| **Nombre** | Fueradecontexto |
| **Categoría** | Indumentaria & Accesorios |
| **Estética** | Minimalismo elevado, editorial, sofisticación moderna |
| **Vibe** | Limpio, espacioso, con acentos vibrantes (fucsia) |
| **Tono visual** | Lujo accesible — no ostentoso, sí refinado |

La marca comunica exclusividad a través del silencio visual: mucho espacio en blanco, tipografía dominante, fotografía con foco absoluto en el producto.

---

## 2. Paleta de Colores

### Tokens de color

| Nombre | HEX | CSS Variable | Uso |
|---|---|---|---|
| White | `#FFFFFF` | `--color-background` | Fondo principal |
| Off-white | `#F9F9F9` | `--color-surface` | Tarjetas, secciones alternadas |
| Light gray | `#E5E5E5` | `--color-border` | Bordes, divisores |
| Mid gray | `#9E9E9E` | `--color-muted-foreground` | Texto secundario, placeholders |
| Near black | `#1A1A1A` | `--color-foreground` | Texto principal, headings |
| Pure black | `#000000` | `--color-primary-dark` | Botones secundarios, acentos fuertes |
| Fucsia | `#E91E8C` | `--color-primary` | CTA, acciones primarias, énfasis |
| Fucsia dark | `#C4177A` | `--color-primary-hover` | Estado hover del fucsia |
| Fucsia light | `#FCE4F3` | `--color-primary-subtle` | Fondos sutiles, badges |

### Mapeo semántico shadcn v4

| Token shadcn | Variable del proyecto |
|---|---|
| `background` | `--color-background` |
| `foreground` | `--color-foreground` |
| `primary` | `--color-primary` |
| `primary-foreground` | `#FFFFFF` |
| `muted` | `--color-surface` |
| `muted-foreground` | `--color-muted-foreground` |
| `border` | `--color-border` |
| `ring` | `--color-primary` |
| `card` | `--color-surface` |
| `card-foreground` | `--color-foreground` |

### Variables CSS — incluir en `globals.css`

```css
@import "tailwindcss";

@theme inline {
  --color-background: #FFFFFF;
  --color-surface: #F9F9F9;
  --color-border: #E5E5E5;
  --color-muted-foreground: #9E9E9E;
  --color-foreground: #1A1A1A;
  --color-primary-dark: #000000;
  --color-primary: #E91E8C;
  --color-primary-hover: #C4177A;
  --color-primary-subtle: #FCE4F3;

  /* Mapeo semántico shadcn */
  --background: var(--color-background);
  --foreground: var(--color-foreground);
  --primary: var(--color-primary);
  --primary-foreground: #FFFFFF;
  --muted: var(--color-surface);
  --muted-foreground: var(--color-muted-foreground);
  --border: var(--color-border);
  --ring: var(--color-primary);
  --card: var(--color-surface);
  --card-foreground: var(--color-foreground);
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Regla 60-30-10

> **OBLIGATORIO.** La proporción de color en cualquier pantalla debe respetar:
> - **60%** — Blancos y neutros (`background`, `surface`)
> - **30%** — Negro y texto oscuro (`foreground`, `primary-dark`)
> - **10%** — Fucsia (`primary`) — solo en CTAs, highlights y elementos de énfasis

---

## 3. Tipografía

### Fuentes

| Fuente | Familia | Uso | Variable CSS |
|---|---|---|---|
| Cormorant Garamond | Serif | Headings, títulos editoriales | `--font-serif` |
| Inter | Sans-serif | UI, cuerpo, labels, navegación | `--font-sans` |

### Configuración en `layout.tsx`

```tsx
import { Cormorant_Garamond, Inter } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
```

### Configuración en `globals.css`

```css
@theme inline {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-serif: 'Cormorant Garamond', Georgia, serif;
}
```

### Escala tipográfica

| Rol | Tamaño | Peso | Fuente | Clase Tailwind |
|---|---|---|---|---|
| Display / Hero | 72px | 300 | Serif | `text-7xl font-light font-serif` |
| H1 | 48px | 400 | Serif | `text-5xl font-normal font-serif` |
| H2 | 36px | 400 | Serif | `text-4xl font-normal font-serif` |
| H3 | 24px | 500 | Serif | `text-2xl font-medium font-serif` |
| H4 | 20px | 500 | Sans | `text-xl font-medium` |
| Body Large | 18px | 400 | Sans | `text-lg` |
| Body | 16px | 400 | Sans | `text-base` |
| Body Small | 14px | 400 | Sans | `text-sm` |
| Caption / Label | 12px | 500 | Sans | `text-xs font-medium tracking-wide uppercase` |
| Price | 20px | 600 | Sans | `text-xl font-semibold` |

### Reglas de uso tipográfico

- **SIEMPRE** usar `font-serif` (Cormorant Garamond) para headings editoriales (H1, H2, H3, nombres de producto en hero)
- **SIEMPRE** usar `font-sans` (Inter) para UI: navegación, botones, labels, párrafos de cuerpo, precios
- **NUNCA** usar Cormorant en textos de menos de 16px — pierde legibilidad
- **SIEMPRE** usar `tracking-wide uppercase text-xs` para etiquetas de categoría y metadatos

---

## 4. Layout & Espaciado

### Sistema base: 8px

| Token | Valor | Clase Tailwind | Uso |
|---|---|---|---|
| XS | 4px | `gap-1`, `p-1` | Micro-espaciado interno |
| SM | 8px | `gap-2`, `p-2` | Separación entre elementos relacionados |
| MD | 16px | `gap-4`, `p-4` | Padding interno de cards y componentes |
| LG | 24px | `gap-6`, `p-6` | Espaciado entre secciones próximas |
| XL | 32px | `gap-8`, `p-8` | Padding de secciones |
| 2XL | 48px | `gap-12`, `py-12` | Separación entre bloques |
| 3XL | 64px | `gap-16`, `py-16` | Secciones principales del layout |
| 4XL | 96px | `gap-24`, `py-24` | Hero y secciones de máximo impacto visual |

### Ancho máximo del contenido

```
max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8
```

- **Max-width**: 1280px (`max-w-screen-xl`)
- **Padding horizontal**: 16px mobile → 24px tablet → 32px desktop
- **NUNCA** usar `max-w-full` sin padding lateral en contenido editorial

### Grid de productos

```tsx
// Grid responsivo estándar para listado de productos
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {products.map(product => <ProductCard key={product.id} {...product} />)}
</div>
```

| Breakpoint | Columnas | Gap |
|---|---|---|
| Mobile (< 640px) | 1 col | 24px |
| Tablet (640–1023px) | 2 col | 24px |
| Desktop (≥ 1024px) | 4 col | 24px |

---

## 5. Componentes UI

### Botones

#### Primario (CTA principal — Fucsia)
```tsx
<Button className="bg-primary text-white hover:bg-[var(--color-primary-hover)] rounded-none px-8 py-3 text-sm font-medium tracking-widest uppercase transition-colors">
  Comprar ahora
</Button>
```

#### Secundario (Outline negro)
```tsx
<Button variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-white rounded-none px-8 py-3 text-sm font-medium tracking-widest uppercase transition-colors">
  Ver colección
</Button>
```

#### Ghost (Acción terciaria)
```tsx
<Button variant="ghost" className="text-muted-foreground hover:text-foreground px-0 text-sm underline-offset-4 hover:underline">
  Ver más
</Button>
```

**Reglas de botones:**
- `rounded-none` — SIEMPRE. Los bordes redondeados rompen la estética editorial
- `tracking-widest uppercase` — Para texto de botón principal y secundario
- NUNCA usar más de un botón primario (fucsia) por sección visible

### Product Cards

```tsx
// Estructura interna de ProductCard
<article className="group cursor-pointer">
  {/* Imagen: aspect-ratio cuadrado o 3:4 */}
  <div className="relative aspect-[3/4] overflow-hidden bg-surface">
    <Image
      src={product.image}
      alt={product.name}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
    />
  </div>

  {/* Info del producto */}
  <div className="pt-4 space-y-1">
    <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
      {product.category}
    </p>
    <h3 className="text-base font-medium text-foreground leading-snug">
      {product.name}
    </h3>
    <p className="text-base font-semibold text-foreground">
      ${product.price.toLocaleString('es-AR')}
    </p>
  </div>
</article>
```

**Reglas de cards:**
- `rounded-none` — Sin border-radius en cards de producto
- `aspect-[3/4]` preferido para indumentaria; `aspect-square` para accesorios
- Hover: scale sutil en imagen (`scale-105`), nunca elevación con sombra pesada
- `object-cover` — SIEMPRE. Nunca `object-contain` en imágenes de producto

### Inputs & Formularios

```tsx
<Input className="rounded-none border-border focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground" />
```

| Estado | Estilo |
|---|---|
| Default | `border border-border` |
| Focus | `border-primary ring-1 ring-primary` |
| Error | `border-destructive ring-1 ring-destructive` |
| Disabled | `opacity-50 cursor-not-allowed bg-muted` |

### Regla de tokens semánticos

> **OBLIGATORIO.** SIEMPRE usar tokens semánticos de shadcn/Tailwind. NUNCA hardcodear valores hex en className o style.

```tsx
// CORRECTO
<div className="bg-primary text-primary-foreground border-border" />

// INCORRECTO — NUNCA hacer esto
<div style={{ backgroundColor: '#E91E8C', color: '#fff' }} />
<div className="bg-[#E91E8C]" />
```

---

## 6. Iconografía & Fotografía

### Iconos

- **Estilo**: Lineal, stroke de 1–1.5px, esquinas suaves pero no redondeadas en exceso
- **Librería recomendada**: `lucide-react` (ya incluida en shadcn)
- **Tamaños estándar**: 16px (inline), 20px (UI), 24px (navegación)
- **NUNCA** usar iconos filled/sólidos en contextos UI — solo en estados activos específicos

```tsx
import { ShoppingBag, Search, User, X } from 'lucide-react'

<ShoppingBag className="h-5 w-5 stroke-[1.5]" />
```

### Fotografía

- **Composición**: Mucho espacio negativo, fondo neutro (blanco o off-white)
- **Foco**: Producto protagonista, sin elementos distractores
- **Paleta fotográfica**: Tonos fríos a neutros — evitar warmth excesivo o filtros saturados
- **Formato**: WebP preferido, con fallback JPG
- **OBLIGATORIO**: Usar `next/image` en TODAS las imágenes

```tsx
import Image from 'next/image'

// CORRECTO — siempre con sizes y alt descriptivo
<Image
  src="/productos/camisa-01.webp"
  alt="Camisa lino blanco oversize — Fueradecontexto"
  fill
  className="object-cover"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
  priority={isAboveFold}
/>

// INCORRECTO — NUNCA usar <img> nativo
<img src="/productos/camisa-01.webp" />
```

---

## 7. Stack Técnico

| Capa | Tecnología | Versión | Notas |
|---|---|---|---|
| **Framework** | Next.js | 14+ | App Router — RSC por defecto |
| **Lenguaje** | TypeScript | 5+ | `strict: true` obligatorio |
| **Estilos** | Tailwind CSS | v4 | `@import "tailwindcss"` en globals.css |
| **Componentes** | shadcn/ui | v4 | Única librería UI permitida |
| **Base de datos** | Neon Serverless Postgres | latest | Via `@neondatabase/serverless` |
| **ORM** (opcional) | Drizzle ORM | latest | Preferido sobre queries raw |
| **Fuentes** | next/font/google | built-in | Cormorant Garamond + Inter |
| **Imágenes** | next/image | built-in | Obligatorio para todas las imágenes |

### Configuración TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Conexión a Neon DB

```ts
// lib/db.ts
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export { sql }
```

```ts
// Uso en Server Component o Server Action
import { sql } from '@/lib/db'

const products = await sql`
  SELECT id, name, price, image_url, category
  FROM products
  WHERE active = true
  ORDER BY created_at DESC
`
```

---

## 8. Convenciones de Código

### Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Archivos de componente | `kebab-case.tsx` | `product-card.tsx` |
| Archivos de página | `page.tsx` | `app/productos/page.tsx` |
| Archivos de utilidad | `kebab-case.ts` | `format-price.ts` |
| Componentes React | `PascalCase` | `ProductCard` |
| Variables / funciones | `camelCase` | `fetchProducts` |
| Constantes | `SCREAMING_SNAKE_CASE` | `MAX_PRODUCTS_PER_PAGE` |
| Tipos e interfaces | `PascalCase` | `type Product = {...}` |

### Server Components vs Client Components

```tsx
// CORRECTO — Server Component por defecto (sin directiva)
// app/productos/page.tsx
import { sql } from '@/lib/db'
import { ProductGrid } from '@/components/product-grid'

export default async function ProductsPage() {
  const products = await sql`SELECT * FROM products WHERE active = true`
  return <ProductGrid products={products} />
}

// CORRECTO — Client Component solo cuando es necesario
// components/add-to-cart-button.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false)
  // ...
}
```

**Cuándo usar `"use client"`:**
- `useState`, `useEffect`, `useReducer`, `useRef`
- Event handlers interactivos (`onClick`, `onChange`, `onSubmit`)
- APIs de browser (`localStorage`, `window`, `navigator`)
- Animaciones con estado

**NUNCA usar `"use client"` en:**
- Páginas que solo muestran datos (`page.tsx` en rutas data-fetching)
- Layouts (`layout.tsx`)
- Componentes puramente presentacionales sin estado

### Estructura de carpetas

```
src/
├── app/                    # App Router — rutas y layouts
│   ├── layout.tsx          # Root layout con fuentes
│   ├── page.tsx            # Homepage
│   ├── productos/
│   │   ├── page.tsx        # Listado de productos
│   │   └── [slug]/
│   │       └── page.tsx    # Detalle de producto
│   └── globals.css         # Variables CSS + Tailwind
├── components/
│   ├── ui/                 # Componentes shadcn (auto-generados)
│   └── [feature]/          # Componentes del proyecto
├── lib/
│   ├── db.ts               # Cliente Neon
│   └── utils.ts            # cn() y utilidades
└── types/
    └── index.ts            # Tipos globales del proyecto
```

### Server Actions

```ts
// app/actions/cart.ts
'use server'

import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addToCart(productId: string, quantity: number) {
  await sql`
    INSERT INTO cart_items (product_id, quantity)
    VALUES (${productId}, ${quantity})
    ON CONFLICT (product_id) DO UPDATE SET quantity = cart_items.quantity + ${quantity}
  `
  revalidatePath('/carrito')
}
```

---

## 9. Reglas de Oro

> Estas reglas son absolutas. No hay excepciones. No hay "casos especiales".

1. **`rounded-none` SIEMPRE en botones y cards de producto.** Los bordes redondeados destruyen la estética editorial de la marca.

2. **NUNCA instalar una librería UI alternativa a shadcn/ui.** No Chakra, no MUI, no Ant Design, no Mantine. Solo shadcn v4.

3. **NUNCA hardcodear valores hex o colores directos.** Solo tokens semánticos (`bg-primary`, `text-muted-foreground`, `border-border`).

4. **NUNCA usar `<img>` nativo.** Siempre `next/image` con `alt` descriptivo y `sizes` correcto.

5. **`"use client"` es el último recurso.** Primero explorá si el componente puede ser Server Component. Solo agregá la directiva cuando sea estrictamente necesario.

6. **El fucsia (`primary`) es el 10%.** Un solo CTA principal por sección visible. No lo uses como color decorativo o de fondo extenso.

7. **Tipografía serif solo en headings.** Cormorant Garamond nunca en botones, labels, precios, navegación ni texto de menos de 16px.

8. **TypeScript estricto, siempre.** No usar `any`, no ignorar errores con `@ts-ignore`, no usar `!` non-null assertion sin justificación.

9. **Queries a base de datos solo en Server Components o Server Actions.** Nunca en Client Components. Nunca exponer credenciales al cliente.

10. **Espaciado con el sistema de 8px.** No inventar valores arbitrarios. Si Tailwind no tiene el token exacto, usar el más próximo del sistema definido.

---

*Documento generado: 2026-03-18 | Stack: Next.js 14+ · TypeScript · Tailwind CSS v4 · shadcn/ui v4 · Neon DB*
