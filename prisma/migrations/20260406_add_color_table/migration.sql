CREATE TABLE "Color" (
  "id"        TEXT NOT NULL DEFAULT gen_random_uuid(),
  "name"      TEXT NOT NULL,
  "hex"       TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Color_name_key" ON "Color"("name");
