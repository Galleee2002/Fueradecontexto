CREATE TABLE IF NOT EXISTS "ShippingProviderSettings" (
  "id" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "originPostalCode" TEXT NOT NULL,
  "senderName" TEXT NOT NULL,
  "senderEmail" TEXT NOT NULL,
  "senderPhone" TEXT NOT NULL,
  "senderStreet" TEXT NOT NULL,
  "senderStreetNumber" TEXT NOT NULL,
  "senderFloor" TEXT NOT NULL DEFAULT '',
  "senderApartment" TEXT NOT NULL DEFAULT '',
  "senderCity" TEXT NOT NULL,
  "senderProvinceCode" TEXT NOT NULL,
  "senderPostalCode" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ShippingProviderSettings_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ShippingProviderSettings_provider_key"
ON "ShippingProviderSettings"("provider");
