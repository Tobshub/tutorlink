CREATE EXTENSION IF NOT EXISTS vector;

-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "embedding" vector;

-- AlterTable
ALTER TABLE "TutorProfile" ADD COLUMN     "embedding" vector;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'STUDENT';
