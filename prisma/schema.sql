-- Abadii database schema
-- Paste this whole file into your database provider's web SQL editor
-- (Neon: Dashboard -> SQL Editor. Supabase: SQL Editor -> New query.)
-- Run it once, before your first deploy.

CREATE TYPE "Role" AS ENUM ('WORKER', 'EMPLOYER', 'ADMIN');
CREATE TYPE "EmployerPlan" AS ENUM ('FREE', 'GROWTH', 'UNLIMITED');
CREATE TYPE "ShortlistStatus" AS ENUM ('SHORTLISTED', 'CONTACTED', 'INTERVIEWING', 'OFFERED', 'HIRED', 'REJECTED');
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED');

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "role" "Role" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Skill" (
  "id" TEXT PRIMARY KEY,
  "nameEn" TEXT NOT NULL UNIQUE,
  "nameAr" TEXT NOT NULL
);

CREATE TABLE "WorkerProfile" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
  "fullName" TEXT NOT NULL,
  "countryOfOrigin" TEXT NOT NULL,
  "currentCountry" TEXT NOT NULL,
  "dateOfBirth" TIMESTAMP(3),
  "photoUrl" TEXT,
  "videoIntroUrl" TEXT,
  "bioEn" TEXT,
  "bioAr" TEXT,
  "trade" TEXT NOT NULL,
  "yearsOutdoorHeatExp" INTEGER NOT NULL DEFAULT 0,
  "languages" TEXT[] NOT NULL DEFAULT '{}',
  "availableFrom" TIMESTAMP(3),
  "expectedSalaryUsd" INTEGER,
  "heatSafetyTrained" BOOLEAN NOT NULL DEFAULT false,
  "medicalClearance" BOOLEAN NOT NULL DEFAULT false,
  "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "WorkerProfile_trade_idx" ON "WorkerProfile"("trade");
CREATE INDEX "WorkerProfile_countryOfOrigin_idx" ON "WorkerProfile"("countryOfOrigin");

CREATE TABLE "WorkerSkill" (
  "id" TEXT PRIMARY KEY,
  "workerId" TEXT NOT NULL REFERENCES "WorkerProfile"("id") ON DELETE CASCADE,
  "skillId" TEXT NOT NULL REFERENCES "Skill"("id") ON DELETE CASCADE,
  "yearsExp" INTEGER NOT NULL DEFAULT 0,
  UNIQUE ("workerId", "skillId")
);

CREATE TABLE "EmployerProfile" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
  "companyName" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "industry" TEXT,
  "companyLicenseUrl" TEXT,
  "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
  "plan" "EmployerPlan" NOT NULL DEFAULT 'FREE',
  "profileUnlocksUsed" INTEGER NOT NULL DEFAULT 0,
  "profileUnlocksReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Shortlist" (
  "id" TEXT PRIMARY KEY,
  "employerId" TEXT NOT NULL REFERENCES "EmployerProfile"("id") ON DELETE CASCADE,
  "workerId" TEXT NOT NULL REFERENCES "WorkerProfile"("id") ON DELETE CASCADE,
  "status" "ShortlistStatus" NOT NULL DEFAULT 'SHORTLISTED',
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("employerId", "workerId")
);

CREATE TABLE "Review" (
  "id" TEXT PRIMARY KEY,
  "workerId" TEXT NOT NULL REFERENCES "WorkerProfile"("id") ON DELETE CASCADE,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
