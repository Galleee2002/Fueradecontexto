# Correo Argentino: Implementación y Puesta en Producción

## Resumen

Se implementó la integración de Correo Argentino MiCorreo para cotizar envíos a domicilio en checkout, persistir el snapshot logístico en la orden, cobrar el envío junto con los productos en Mercado Pago e importar el envío a MiCorreo cuando el pago queda `approved`.

La integración está pensada para:

- `deliveryType = "D"` únicamente
- una cuenta única del comercio en MiCorreo
- un remitente/origen fijo configurado por variables de entorno
- importación automática post-pago
- tracking consultable desde backoffice cuando la orden ya tiene `trackingNumber` o `shippingExternalId`

## Qué quedó implementado

### Backend de Correo Argentino

Se agregó la capa:

- [src/shared/infrastructure/shipping/correo-argentino/config.ts](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/src/shared/infrastructure/shipping/correo-argentino/config.ts)
- [src/shared/infrastructure/shipping/correo-argentino/client.ts](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/src/shared/infrastructure/shipping/correo-argentino/client.ts)
- [src/shared/infrastructure/shipping/correo-argentino/types.ts](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/src/shared/infrastructure/shipping/correo-argentino/types.ts)
- [src/shared/infrastructure/shipping/correo-argentino/utils.ts](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/src/shared/infrastructure/shipping/correo-argentino/utils.ts)
- [src/shared/infrastructure/shipping/correo-argentino/errors.ts](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/src/shared/infrastructure/shipping/correo-argentino/errors.ts)

Comportamiento:

- autentica contra `POST /token` usando Basic Auth
- reutiliza JWT en memoria hasta su expiración
- reintenta una vez si recibe `401`
- consume:
  - `POST /rates`
  - `POST /shipping/import`
  - `GET /shipping/tracking`
- normaliza código postal y provincia antes de enviar requests

### Checkout

Se modificó el flujo de checkout en:

- [src/app/(site)/checkout/page.tsx](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/src/app/(site)/checkout/page.tsx)
- [src/features/checkout/actions/checkout-actions.ts](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/src/features/checkout/actions/checkout-actions.ts)
- [src/features/checkout/application/build-shipping-quote.ts](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/src/features/checkout/application/build-shipping-quote.ts)
- [src/features/checkout/application/create-order-and-preference.ts](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/src/features/checkout/application/create-order-and-preference.ts)
- [src/features/checkout/components/step-payment.tsx](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/src/features/checkout/components/step-payment.tsx)
- [src/features/checkout/components/order-summary.tsx](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/src/features/checkout/components/order-summary.tsx)

Comportamiento:

- al llegar al paso de pago se cotiza el envío con Correo Argentino
- la cotización se invalida si cambia el carrito o la dirección
- el usuario ve:
  - nombre del servicio
  - costo
  - plazo estimado
- no se puede iniciar el pago sin una cotización válida
- la orden se crea con:
  - costo de envío
  - método
  - carrier
  - dimensiones consolidadas
  - snapshot de cotización
- Mercado Pago recibe una línea adicional:
  - `Envio Correo Argentino`

### Lógica logística y persistencia

Se agregó persistencia logística en:

- [prisma/schema.prisma](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/prisma/schema.prisma)
- [prisma/migrations/20260416_add_correo_argentino_shipping/migration.sql](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/prisma/migrations/20260416_add_correo_argentino_shipping/migration.sql)
- [src/features/checkout/infrastructure/order-repository.ts](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/src/features/checkout/infrastructure/order-repository.ts)

Campos nuevos en `Product`:

- `shippingWeightGrams`
- `shippingHeightCm`
- `shippingWidthCm`
- `shippingLengthCm`

Campos nuevos en `Order`:

- `shippingMethod`
- `shippingCarrier`
- `shippingCost`
- `shippingQuotePayload`
- `shippingDimensions`
- `shippingStatus`
- `shippingExternalId`
- `trackingNumber`
- `shippingTrackingPayload`
- `shippingImportedAt`
- `shippingLastSyncAt`
- `shippingError`

### Webhook post-pago

Se extendió:

- [src/app/api/mercadopago/webhook/route.ts](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/src/app/api/mercadopago/webhook/route.ts)
- [src/features/checkout/application/sync-order-shipping.ts](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/src/features/checkout/application/sync-order-shipping.ts)

Comportamiento:

- cuando Mercado Pago confirma `approved`
  - descuenta stock
  - marca la orden como `import_pending`
  - importa el envío a MiCorreo
- si la importación falla
  - la orden conserva `status = paid`
  - `shippingStatus` pasa a `import_failed`
  - se registra `shippingError`
- si MiCorreo responde que la orden ya fue importada
  - se toma como idempotente
  - la orden queda `imported`

### Admin

Se actualizó el backoffice en:

- [src/features/admin/components/product-form.tsx](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/src/features/admin/components/product-form.tsx)
- [src/features/admin/components/orders-table.tsx](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/src/features/admin/components/sync-order-tracking-button.tsx)
- [src/features/admin/actions/order-actions.ts](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/src/features/admin/actions/order-actions.ts)
- [src/features/admin/queries/admin-queries.ts](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/src/features/admin/queries/admin-queries.ts)

Comportamiento:

- productos ahora exigen dimensiones logísticas
- órdenes muestran:
  - método de envío
  - costo
  - estado logístico
  - tracking o último evento disponible
- existe acción manual para sincronizar tracking desde admin

## Variables de entorno requeridas

La integración necesita estas variables server-side:

```env
SHIPPING_CORREO_ARGENTINO_ENABLED=true
CORREO_ARGENTINO_BASE_URL=https://api.correoargentino.com.ar/micorreo/v1
CORREO_ARGENTINO_USERNAME=...
CORREO_ARGENTINO_PASSWORD=...
```

La configuración operativa no secreta se administra desde:

- `/admin/envios`

Allí se cargan:

- `customerId`
- código postal de origen
- remitente y contacto operativo
- dirección completa de origen

Notas operativas:

- `customerId` debe persistirse como string numérico de 10 dígitos. Si Correo entrega un valor más corto, debe completarse con ceros a la izquierda.
- la respuesta real de `POST /token` en producción puede devolver `expire` en lugar de `expires`, por lo que el cliente debe aceptar ambas variantes.

Además siguen siendo necesarias las variables ya existentes de:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `MERCADOPAGO_ACCESS_TOKEN`
- `MERCADOPAGO_WEBHOOK_SECRET`
- auth / NextAuth si corresponde al entorno

## Estado de flags y estados logísticos

Flag:

- `SHIPPING_CORREO_ARGENTINO_ENABLED`
  - `true` o ausente: integración habilitada
  - `false`: se desactiva la cotización para degradar el flujo

Estados logísticos definidos en:

- [src/shared/config/shipping.ts](/Users/gaeldev/Desktop/Fueradecontexto/Fueradecontexto/src/shared/config/shipping.ts)

Valores:

- `not_imported`
- `import_pending`
- `imported`
- `in_transit`
- `delivered`
- `import_failed`

## Pasos para ponerlo en producción

### 1. Confirmar prerequisitos operativos

Antes del deploy:

- cargar `customerId` real de MiCorreo del comercio en `/admin/envios`
- cargar remitente y dirección de origen reales en `/admin/envios`
- confirmar credenciales separadas para QA y Producción
- revisar si las credenciales compartidas fuera de un gestor de secretos deben rotarse

### 2. Cargar variables en Vercel

En Preview:

- usar `CORREO_ARGENTINO_BASE_URL=https://apitest.correoargentino.com.ar/micorreo/v1`
- cargar credenciales QA

En Production:

- usar `CORREO_ARGENTINO_BASE_URL=https://api.correoargentino.com.ar/micorreo/v1`
- cargar credenciales productivas

Mantener `SHIPPING_CORREO_ARGENTINO_ENABLED=true` sólo cuando QA ya esté validado.

### 3. Aplicar migraciones

Si todavía no se aplicaron en el entorno objetivo:

```bash
pnpm prisma migrate deploy
pnpm prisma migrate status
```

Estado esperado:

- `Database schema is up to date!`

### 4. Completar configuración en admin

Antes de habilitar checkout productivo:

- entrar a `/admin/envios`
- guardar:
  - `customerId`
  - CP de origen
  - nombre, email y teléfono del remitente
  - calle, altura, piso/depto, ciudad, provincia y CP del remitente

Sin esta configuración:

- la cotización falla
- la importación post-pago falla

### 5. Completar datos logísticos de productos

Antes de habilitar checkout productivo:

- entrar al admin de productos
- completar para cada producto vendible:
  - peso
  - alto
  - ancho
  - largo

Si un producto no tiene estos datos:

- la cotización falla
- el checkout no puede continuar a pago

### 6. Desplegar aplicación

Comandos verificados localmente:

```bash
pnpm lint
pnpm build
```

Luego desplegar con el flujo normal del proyecto.

### 7. Validación QA obligatoria

Probar en Preview o QA:

1. Agregar un producto con datos logísticos completos al carrito.
2. Ir a checkout.
3. Completar dirección válida.
4. Verificar que aparezca cotización real en el paso de pago.
5. Confirmar que el total incluya el envío.
6. Completar una compra de prueba con Mercado Pago.
7. Verificar que el webhook:
   - marque la orden como `paid`
   - deje `shippingStatus = imported` o `import_failed`
8. Revisar la orden en admin.

### 7. Habilitación productiva

Checklist mínimo:

- migración aplicada
- variables productivas cargadas
- productos con datos logísticos completos
- compra QA validada punta a punta
- webhook de Mercado Pago llegando correctamente
- `SHIPPING_CORREO_ARGENTINO_ENABLED=true`

## Verificaciones post-deploy

### Verificación técnica inmediata

Después del deploy productivo:

1. abrir `/checkout`
2. validar una cotización con un CP conocido
3. crear una compra controlada
4. verificar en admin:
   - monto correcto
   - envío persistido
   - estado logístico correcto

### Verificación de base

Consultar órdenes recientes y revisar:

- `shippingMethod`
- `shippingCarrier`
- `shippingCost`
- `shippingQuotePayload`
- `shippingDimensions`
- `shippingStatus`

## Límites conocidos de la implementación actual

Hay una limitación importante del contrato actual de MiCorreo:

- la documentación usada para `POST /shipping/import` devuelve `createdAt`
- no documenta explícitamente `trackingNumber` en la respuesta de importación

Impacto:

- la orden puede quedar `imported` sin tracking persistido
- la acción manual de sync de tracking desde admin sólo funciona si la orden ya tiene `trackingNumber` o `shippingExternalId`

Esto no rompe checkout ni importación, pero sí limita el tracking end-to-end si MiCorreo no devuelve o no expone ese identificador por otra vía.

## Rollback operativo

Si Correo Argentino empieza a fallar en producción:

1. poner `SHIPPING_CORREO_ARGENTINO_ENABLED=false`
2. redeploy
3. validar que el checkout deje de intentar cotizar
4. no revertir migraciones

Notas:

- desactivar el flag evita seguir cotizando/importando
- no corrige órdenes ya importadas o ya fallidas
- las órdenes pagadas con `import_failed` requieren revisión operativa

## Recuperación ante errores comunes

### Error: faltan variables de entorno

Síntoma:

- error server-side al cotizar o importar
- mensaje parecido a `CORREO_ARGENTINO_* is not configured`

Acción:

- revisar variables del entorno
- redeploy si faltaba alguna

### Error: `import_failed`

Síntoma:

- orden `paid`
- `shippingStatus = import_failed`

Acción:

- revisar `shippingError`
- validar remitente, `customerId`, CP, provincia y dimensiones
- si corregís datos externos, reintentar manualmente con una acción operativa o desde script futuro

### Error: carrito no cotiza

Causas típicas:

- producto sin dimensiones
- CP inválido
- provincia no mapeable
- servicio de Correo Argentino caído

Acción:

- revisar datos del producto
- revisar dirección ingresada
- revisar conectividad/credenciales de MiCorreo

## Validaciones realizadas en esta implementación

Se verificó localmente:

```bash
pnpm prisma migrate deploy
pnpm prisma migrate status
pnpm lint
pnpm build
```

Resultado:

- migraciones aplicadas
- schema Prisma consistente
- lint OK
- build OK

## Próximos pasos recomendados

- agregar una acción explícita de reintento manual de `shipping/import` para órdenes `import_failed`
- incorporar una fuente confiable para obtener `trackingNumber` inmediatamente después de importar
- agregar monitoreo/alertas sobre `import_failed`, `401`, `429` y `5xx`
- documentar el procedimiento operativo de soporte para órdenes pagadas sin tracking
