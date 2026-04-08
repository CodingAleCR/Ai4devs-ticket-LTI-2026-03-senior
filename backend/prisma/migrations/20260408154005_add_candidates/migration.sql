-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cvOriginalName" TEXT,
    "cvStoredFileName" TEXT,
    "cvMimeType" TEXT,
    "cvSizeBytes" INTEGER,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationEntry" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "yearEnd" TEXT,

    CONSTRAINT "EducationEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkExperienceEntry" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "WorkExperienceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_email_key" ON "Candidate"("email");

-- AddForeignKey
ALTER TABLE "EducationEntry" ADD CONSTRAINT "EducationEntry_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperienceEntry" ADD CONSTRAINT "WorkExperienceEntry_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
