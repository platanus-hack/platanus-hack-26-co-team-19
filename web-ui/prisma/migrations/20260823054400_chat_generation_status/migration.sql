-- AlterTable
ALTER TABLE "chat_conversation" ADD COLUMN "generationStatus" TEXT NOT NULL DEFAULT 'idle';
ALTER TABLE "chat_conversation" ADD COLUMN "generationError" TEXT;
