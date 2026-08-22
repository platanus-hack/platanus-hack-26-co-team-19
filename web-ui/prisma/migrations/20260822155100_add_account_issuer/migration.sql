-- AlterTable
ALTER TABLE "account" ADD COLUMN "issuer" TEXT NOT NULL DEFAULT 'local:credential';

UPDATE "account"
SET "issuer" = 'local:credential'
WHERE "providerId" = 'credential' AND ("issuer" IS NULL OR "issuer" = '');

-- CreateIndex
CREATE UNIQUE INDEX "account_issuer_accountId_key" ON "account"("issuer", "accountId");
