/*
  Warnings:

  - The `embedding` column on the `StudentProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `embedding` column on the `TutorProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "embedding",
ADD COLUMN     "embedding" DOUBLE PRECISION[];

-- AlterTable
ALTER TABLE "TutorProfile" DROP COLUMN "embedding",
ADD COLUMN     "embedding" DOUBLE PRECISION[];
