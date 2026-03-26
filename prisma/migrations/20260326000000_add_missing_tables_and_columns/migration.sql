-- Migration: add_missing_tables_and_columns
-- Brings the live Neon DB into sync with prisma/schema.prisma
-- All statements are idempotent (IF NOT EXISTS) to be safe with out-of-band changes

-- ── 1. Fix Product.updatedAt: add DEFAULT so bare INSERTs don't fail ──
ALTER TABLE "Product"
  ALTER COLUMN "updatedAt" SET DEFAULT NOW();

-- ── 2. Add Product columns added manually to Neon but not in initial migration ──
ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "stock"           INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "availableColors" JSONB   NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS "availableSizes"  JSONB   NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS "stampSizes"      JSONB   NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS "stampLocations"  JSONB   NOT NULL DEFAULT '[]'::jsonb;

-- ── 3. Fix CartItem: unique index required by ON CONFLICT in addToCart ──
CREATE UNIQUE INDEX IF NOT EXISTS "CartItem_productId_sessionId_key"
  ON "CartItem"("productId", "sessionId");

-- ── 4. Category table ──
CREATE TABLE IF NOT EXISTS "Category" (
    "id"        TEXT         NOT NULL DEFAULT gen_random_uuid()::text,
    "name"      TEXT         NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "Category"("name");

-- ── 5. SizeGuide table ──
CREATE TABLE IF NOT EXISTS "SizeGuide" (
    "id"        TEXT         NOT NULL DEFAULT gen_random_uuid()::text,
    "category"  TEXT         NOT NULL,
    "rows"      JSONB        NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    CONSTRAINT "SizeGuide_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "SizeGuide_category_key" ON "SizeGuide"("category");

-- ── 6. User table ──
CREATE TABLE IF NOT EXISTS "User" (
    "id"        TEXT         NOT NULL DEFAULT gen_random_uuid()::text,
    "email"     TEXT         NOT NULL,
    "password"  TEXT         NOT NULL,
    "name"      TEXT,
    "role"      TEXT         NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- ── 7. Order table ──
CREATE TABLE IF NOT EXISTS "Order" (
    "id"              TEXT          NOT NULL DEFAULT gen_random_uuid()::text,
    "customerEmail"   TEXT          NOT NULL,
    "customerName"    TEXT          NOT NULL,
    "customerPhone"   TEXT          NOT NULL,
    "userId"          TEXT,
    "total"           DECIMAL(10,2) NOT NULL,
    "status"          TEXT          NOT NULL DEFAULT 'pending',
    "shippingAddress" JSONB         NOT NULL,
    "mpPreferenceId"  TEXT,
    "mpPaymentId"     TEXT,
    "createdAt"       TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3)  NOT NULL DEFAULT NOW(),
    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Order_userId_fkey') THEN
    ALTER TABLE "Order"
      ADD CONSTRAINT "Order_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE SET NULL ON UPDATE CASCADE NOT VALID;
  END IF;
END $$;

-- ── 8. OrderItem table ──
CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id"        TEXT          NOT NULL DEFAULT gen_random_uuid()::text,
    "orderId"   TEXT          NOT NULL,
    "productId" TEXT          NOT NULL,
    "quantity"  INTEGER       NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'OrderItem_orderId_fkey') THEN
    ALTER TABLE "OrderItem"
      ADD CONSTRAINT "OrderItem_orderId_fkey"
      FOREIGN KEY ("orderId") REFERENCES "Order"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE NOT VALID;
  END IF;
END $$;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'OrderItem_productId_fkey') THEN
    ALTER TABLE "OrderItem"
      ADD CONSTRAINT "OrderItem_productId_fkey"
      FOREIGN KEY ("productId") REFERENCES "Product"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE NOT VALID;
  END IF;
END $$;
