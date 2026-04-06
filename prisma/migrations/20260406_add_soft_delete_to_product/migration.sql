-- AddColumn deletedAt to Product for soft delete
ALTER TABLE "Product" ADD COLUMN "deletedAt" TIMESTAMP(3);
