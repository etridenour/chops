/*
  Warnings:

  - You are about to drop the column `timeSigChangeMeasures` on the `Exercise` table. All the data in the column will be lost.
  - Added the required column `segments` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "timeSigChangeMeasures",
ADD COLUMN     "segments" JSONB NOT NULL;
