-- Add previewImages (max 3 enforced at app validation level)
ALTER TABLE "Product"
ADD COLUMN "previewImages" JSONB NOT NULL DEFAULT '[]'::jsonb;
