# Fix: Vercel Deploy — module-not-found en Prisma Client

## Error

```
  #3 [Server Component]:
    ./src/lib/db/prisma.ts
    ./src/auth.ts
    ./src/app/admin/layout.tsx

https://nextjs.org/docs/messages/module-not-found

    at <unknown> (./src/lib/db/prisma.ts:1:1)

ELIFECYCLE  Command failed with exit code 1.
Error: Command "pnpm run build" exited with 1
```

El error aparece en dos grafos de módulos:
- `prisma.ts` ← `checkout-actions.ts`
- `prisma.ts` ← `auth.ts` ← `admin/layout.tsx`

## Causa raíz

Prisma 7 usa el nuevo generador `prisma-client` que emite archivos **TypeScript** en `generated/prisma/`. Estos archivos importan internamente desde `@prisma/client/runtime/client`, que contiene compiladores WASM e inicialización compleja de módulos.

En el entorno local (macOS, Node.js 25) el build funciona correctamente con Turbopack. En Vercel (Linux, Node.js 20.x por defecto) falla por dos razones:

1. **Turbopack intenta bundlear `@prisma/client`** — el runtime WASM de Prisma no se bundlea bien; debe cargarse por Node.js en runtime.
2. **Versión de Node.js incompatible** — `@prisma/client@7.5.0` requiere `^20.19 || ^22.12 || >=24.0`. Vercel defaultea a Node.js 20.18.x o anterior, que no cumple el requisito.
3. **`prisma generate` no corre en Vercel** — los archivos generados estaban en el repo pero no se regeneraban contra el entorno de deploy.

## Archivos modificados

### `next.config.ts`

```ts
serverExternalPackages: ['@prisma/client', '@prisma/adapter-neon'],
```

Le indica a Turbopack que **no bundlee** `@prisma/client`. En su lugar, Node.js lo carga en runtime vía `require()`. Esto evita que Turbopack falle al procesar `@prisma/client/runtime/client` durante el build.

### `package.json`

```json
"scripts": {
  "build": "prisma generate && next build",
  "postinstall": "prisma generate"
},
"engines": {
  "node": ">=22.12"
}
```

- **`build`**: regenera el cliente Prisma antes del build de Next.js en Vercel.
- **`postinstall`**: regenera el cliente después de `pnpm install`, asegurando que los archivos generados correspondan al `@prisma/client` instalado.
- **`engines`**: fuerza a Vercel a usar Node.js 22.12+, que satisface el requisito de `@prisma/client@7.5.0`.

## Por qué el build local funcionaba

Localmente se usa Node.js v25.8.2 (satisface `>=24.0`) y Turbopack en macOS. La combinación de Node.js compatible + diferente manejo de módulos en macOS hacía que el build pasara sin estas configuraciones.

## Notas

- Los archivos en `generated/prisma/` siguen commiteados en el repo (no están en `.gitignore`). Esto es correcto como fallback y para desarrollo local sin correr `prisma generate`.
- `prisma generate` no necesita `DATABASE_URL` para funcionar — solo lee el schema y genera código.
- El middleware (`middleware.ts`) usa `auth.config.ts` (edge-compatible), no `auth.ts`, por lo que no hay conflicto con edge runtime.
