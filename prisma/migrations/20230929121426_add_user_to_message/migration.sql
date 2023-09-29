/*
  Warnings:

  - You are about to drop the column `identifier` on the `Room` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "message" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "identifier";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "username" TEXT;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
