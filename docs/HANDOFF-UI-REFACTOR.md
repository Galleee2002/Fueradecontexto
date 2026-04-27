# Handoff UI Refactor

Fecha: 2026-04-25
Repo: `/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto`
Fuente de verdad visual: `DESIGN.md`

## Estado actual

Se avanzó de forma importante en el refactor visual integral de `Storefront + Admin` con enfoque `system-first`.

Ya quedó implementado:
- nuevo sistema visual base en `src/app/globals.css`
- navegación pública, footer y shells principales
- home editorial y data-driven
- catálogo, grid, filtros y cards de producto
- detalle de producto con nueva jerarquía visual
- carrito y gran parte de checkout
- login, cuenta, ayuda y legales
- shell de admin y varias superficies operativas
- guardrails obligatorios de publicación en admin

## Guardrails de publicación ya implementados

Se agregó validación obligatoria para publicar productos.

Archivo clave:
- `src/features/admin/lib/product-quality.ts`

Bloquea activación/publicación si faltan mínimos:
- nombre válido
- descripción mínima
- imagen válida
- categoría
- precio mayor a 0
- dimensiones/peso para envío

También expone warnings como:
- una sola imagen
- stock 0

## Archivos importantes ya tocados

- `src/app/globals.css`
- `src/features/navigation/components/*`
- `src/features/home/components/*`
- `src/features/products/components/*`
- `src/features/products/ui/product-purchase-panel.tsx`
- `src/features/cart/components/*`
- `src/features/checkout/components/*`
- `src/features/auth/components/*`
- `src/app/(site)/ayuda/page.tsx`
- `src/app/(site)/legal/*`
- `src/features/admin/components/*`
- `src/features/admin/queries/admin-queries.ts`
- `src/features/admin/actions/product-actions.ts`
- `src/features/products/schemas/product-schema.ts`
- `src/features/admin/types.ts`

## Validaciones ya hechas

- `npm run lint` pasó
- `npm run typecheck` pasó
- validación visual manual en Safari sobre:
  - `/`
  - `/productos`
  - `/productos/gorra-trucker`

## Problema abierto actual

Quedó detectado un problema importante en `src/app/globals.css`:

- varias utilidades de marca (`brand-*`) siguen definidas con mezcla de `@apply` y CSS directo
- en runtime algunas clases de marca no se están aplicando de forma consistente
- síntoma visible: el CTA principal del PDP (`Agregar al carrito`) no está renderizando con el tratamiento visual esperado

Además, durante el ajuste final se movió parte de `@layer utilities` a CSS plano, pero ese archivo quedó en transición y necesita una limpieza final para evitar inconsistencias.

## Próximo paso exacto

1. Terminar de normalizar `src/app/globals.css`
2. Sacar las utilidades críticas `brand-*` de cualquier definición inestable y dejarlas en CSS plano consistente
3. Recargar y verificar:
   - `/productos/gorra-trucker`
   - agregar al carrito
   - `/checkout`
   - `/admin/productos`
4. Hacer pasada final de consistencia visual para detectar restos del sistema anterior

## Comando recomendado para retomar

Usar este prompt en un chat nuevo:

`Continuá el refactor visual de Fueradecontexto desde docs/HANDOFF-UI-REFACTOR.md. Revisá DESIGN.md, corregí src/app/globals.css y cerrá la validación visual y funcional restante.`

