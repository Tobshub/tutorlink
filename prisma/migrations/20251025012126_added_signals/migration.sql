-- CreateTable
CREATE TABLE "Signal" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "urgency" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Signal_pkey" PRIMARY KEY ("id")
);
