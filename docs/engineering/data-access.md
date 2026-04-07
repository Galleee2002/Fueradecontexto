# Data Access Rules

- Use Prisma for writes, transactions, and typed entity updates.
- Use raw SQL only for read-heavy queries, aggregates, or cases where SQL shape is significantly clearer.
- Public product visibility means `active = true` and `deletedAt IS NULL`.
- Stock is validated before checkout and decremented only when the Mercado Pago webhook confirms a paid order.
