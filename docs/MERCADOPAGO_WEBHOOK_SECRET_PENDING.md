# Pendiente: Mercado Pago Webhook Secret

## Estado actual

Al 30 de abril de 2026, el `MERCADOPAGO_WEBHOOK_SECRET` real todavía no está disponible.

El endpoint del webhook ya está implementado y debe configurarse en Mercado Pago como:

```txt
https://www.fueradecontexto.com.ar/api/mercadopago/webhook
```

Esa URL no es el secret. El secret es la clave privada que Mercado Pago genera para firmar las notificaciones del webhook.

## Pendiente operativo

Cuando Mercado Pago entregue o muestre el secret:

1. Cargarlo en `.env` y `.env.local` como:

```txt
MERCADOPAGO_WEBHOOK_SECRET=<secret-real-de-mercado-pago>
```

2. Cargar el mismo valor en Vercel, en las variables de entorno de Production.
3. Redeployar producción para que el runtime tome la variable nueva.
4. Confirmar que `MERCADOPAGO_ACCESS_TOKEN` en Vercel pertenece a la misma cuenta donde se crean y cobran las preferencias.
5. Ejecutar primero dry-run de reconciliación:

```bash
pnpm reconcile-paid-orders -- --limit=50
```

6. Si el dry-run encuentra pagos aprobados pendientes, aplicar:

```bash
pnpm reconcile-paid-orders -- --apply --limit=50
```

## Impacto mientras falta el secret

En producción, el webhook rechaza notificaciones si `MERCADOPAGO_WEBHOOK_SECRET` no está configurado. En ese estado:

- las órdenes pagadas pueden quedar en `pending`;
- no se guarda `mpPaymentId`;
- no se disparan los emails post-compra al cliente ni al admin;
- esas órdenes deben recuperarse luego con el script de reconciliación.
