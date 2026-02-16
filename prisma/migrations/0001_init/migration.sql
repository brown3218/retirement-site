-- CreateEnum
CREATE TYPE "ScenarioRunType" AS ENUM ('deterministic', 'monte_carlo', 'historical');

-- CreateEnum
CREATE TYPE "ScenarioRunStatus" AS ENUM ('queued', 'running', 'complete', 'failed');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordCredential" (
    "userId" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordCredential_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Scenario" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP WITH TIME ZONE,

    CONSTRAINT "Scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioVersion" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "schemaVersion" INTEGER NOT NULL,
    "scenarioJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUserId" TEXT,

    CONSTRAINT "ScenarioVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScenarioRun" (
    "id" TEXT NOT NULL,
    "scenarioVersionId" TEXT NOT NULL,
    "runType" "ScenarioRunType" NOT NULL,
    "status" "ScenarioRunStatus" NOT NULL,
    "seed" BIGINT,
    "engineVersion" TEXT NOT NULL,
    "resultJson" JSONB,
    "errorText" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP WITH TIME ZONE,

    CONSTRAINT "ScenarioRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Scenario_userId_idx" ON "Scenario"("userId");

-- CreateIndex
CREATE INDEX "ScenarioVersion_scenarioId_idx" ON "ScenarioVersion"("scenarioId");

-- CreateIndex
CREATE INDEX "ScenarioVersion_createdByUserId_idx" ON "ScenarioVersion"("createdByUserId");

-- CreateIndex
CREATE UNIQUE INDEX "ScenarioVersion_scenarioId_versionNumber_key" ON "ScenarioVersion"("scenarioId", "versionNumber");

-- CreateIndex
CREATE INDEX "ScenarioRun_scenarioVersionId_idx" ON "ScenarioRun"("scenarioVersionId");

-- CreateIndex
CREATE INDEX "ScenarioRun_runType_status_idx" ON "ScenarioRun"("runType", "status");

-- CreateTable relations
ALTER TABLE "PasswordCredential" ADD CONSTRAINT "PasswordCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Scenario" ADD CONSTRAINT "Scenario_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ScenarioVersion" ADD CONSTRAINT "ScenarioVersion_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ScenarioVersion" ADD CONSTRAINT "ScenarioVersion_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ScenarioRun" ADD CONSTRAINT "ScenarioRun_scenarioVersionId_fkey" FOREIGN KEY ("scenarioVersionId") REFERENCES "ScenarioVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
