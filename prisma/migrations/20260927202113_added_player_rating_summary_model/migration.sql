-- CreateTable
CREATE TABLE "player_rating_summary" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "ageGroup" TEXT NOT NULL,
    "teams" TEXT[],
    "totalMatches" INTEGER NOT NULL,
    "totalMinutes" INTEGER NOT NULL,
    "compositeScore" DOUBLE PRECISION NOT NULL,
    "percentile" INTEGER NOT NULL,
    "goals" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "passesCompleted" INTEGER NOT NULL,
    "passAccuracy" DOUBLE PRECISION NOT NULL,
    "duelsWonRatio" DOUBLE PRECISION NOT NULL,
    "recoveries" INTEGER NOT NULL,
    "interceptions" INTEGER NOT NULL,
    "possessionLost" INTEGER NOT NULL,

    CONSTRAINT "player_rating_summary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "player_rating_summary_playerId_key" ON "player_rating_summary"("playerId");

-- AddForeignKey
ALTER TABLE "player_rating_summary" ADD CONSTRAINT "player_rating_summary_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
