-- Delete guest/cookie conversations that are not tied to a real user
DELETE FROM "chat_message"
WHERE "conversationId" IN (
  SELECT c."id"
  FROM "chat_conversation" c
  LEFT JOIN "user" u ON u."id" = c."userId"
  WHERE u."id" IS NULL
);

DELETE FROM "chat_conversation"
WHERE "userId" NOT IN (SELECT "id" FROM "user");

ALTER TABLE "chat_conversation"
ADD CONSTRAINT "chat_conversation_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
