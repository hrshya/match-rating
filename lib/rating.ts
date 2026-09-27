import { prisma } from "@/lib/prisma";

export interface PlayerWithRating {
  id: string;
  name: string;
  ageGroup: string;
  teams: string[];
  totalMatches: number;
  totalMinutes: number;
  compositeScore: number;
  percentile: number;
  stats: {
    goals: number;
    assists: number;
    passesCompleted: number;
    passAccuracy: number;
    duelsWonRatio: number;
    recoveries: number;
    interceptions: number;
    possessionLost: number;
  };
}

export async function calculatePlayerRatings(): Promise<PlayerWithRating[]> {
  const players = await prisma.player.findMany({
    include: {
      appearances: {
        include: { match: true },
      },
    },
  });

  const aggregatedPlayers = players
    .map((player) => {
      if (player.appearances.length === 0) return null;

      let totalMinutes = 0;
      let goals = 0;
      let assists = 0;
      let passesAttempted = 0;
      let passesCompleted = 0;
      let progressivePasses = 0;
      let shotsOnTarget = 0;
      let duelsWon = 0;
      let duelsLost = 0;
      let tackles = 0;
      let interceptions = 0;
      let recoveries = 0;
      let possessionLost = 0;
      let yellowCards = 0;
      let redCards = 0;

      const teamsSet = new Set<string>();
      const ageGroupsSet = new Set<string>();

      player.appearances.forEach((app) => {
        totalMinutes += app.minutesPlayed;
        goals += app.goals;
        assists += app.assists;
        passesAttempted += app.passesAttempted;
        passesCompleted += app.passesCompleted;
        progressivePasses += app.progressivePasses;
        shotsOnTarget += app.shotsOnTarget;
        duelsWon += app.duelsWon;
        duelsLost += app.duelsLost;
        tackles += app.tackles;
        interceptions += app.interceptions;
        recoveries += app.recoveries;
        possessionLost += app.possessionLost;
        yellowCards += app.yellowCards;
        redCards += app.redCards;

        teamsSet.add(app.team);
        if (app.match.ageGroup) ageGroupsSet.add(app.match.ageGroup);
      });

      if (totalMinutes === 0) return null;

      const p90 = 90 / totalMinutes;

      // Stat ratios
      const passAccuracy = passesAttempted > 0 ? passesCompleted / passesAttempted : 0;
      const totalDuels = duelsWon + duelsLost;
      const duelsWonRatio = totalDuels > 0 ? duelsWon / totalDuels : 0;

      const attackScore = (goals * 4 + assists * 3 + shotsOnTarget * 1) * p90;
      const creationScore = (progressivePasses * 1.5 + passesCompleted * 0.05) * p90 * (0.5 + passAccuracy * 0.5);
      const defenseScore = (tackles * 2 + interceptions * 1.5 + recoveries * 1.0 + duelsWon * 1.0) * p90;
      const penaltyScore = (possessionLost * 0.5 + yellowCards * 2 + redCards * 5) * p90;

      const rawCompositeScore = attackScore + creationScore + defenseScore - penaltyScore;

      return {
        id: player.id,
        name: player.name,
        ageGroup: Array.from(ageGroupsSet)[0] || "Unknown",
        teams: Array.from(teamsSet),
        totalMatches: player.appearances.length,
        totalMinutes,
        compositeScore: rawCompositeScore,
        percentile: 0,
        stats: {
          goals,
          assists,
          passesCompleted,
          passAccuracy: Math.round(passAccuracy * 100),
          duelsWonRatio: Math.round(duelsWonRatio * 100),
          recoveries,
          interceptions,
          possessionLost,
        },
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const ageGroupBuckets: Record<string, typeof aggregatedPlayers> = {};
  
  aggregatedPlayers.forEach((player) => {
    if (!ageGroupBuckets[player.ageGroup]) {
      ageGroupBuckets[player.ageGroup] = [];
    }
    ageGroupBuckets[player.ageGroup].push(player);
  });

  const percentileUpdates = Object.values(ageGroupBuckets).flatMap((groupPlayers) => {
    groupPlayers.sort((a, b) => a.compositeScore - b.compositeScore);
    const count = groupPlayers.length;

    return groupPlayers.map(async (player, rankIndex) => {
      player.percentile = Math.round(
        count === 1 ? 100 : ((rankIndex + 1) / count) * 100
      );

      await prisma.player.upsert({
        where: { id: player.id },
        update: { percentile: player.percentile },
        create: { id: player.id, name: player.name, percentile: player.percentile },
      });
    });
  });

  const ratingSummaryUpdates = aggregatedPlayers.map(async (player) => {
    await prisma.playerRatingSummary.upsert({
        where: { playerId: player.id },
        update: {
          ageGroup: player.ageGroup,
          teams: player.teams,
          totalMatches: player.totalMatches,
          totalMinutes: player.totalMinutes,
          compositeScore: player.compositeScore,
          percentile: player.percentile,
          goals: player.stats.goals,
          assists: player.stats.assists,
          passesCompleted: player.stats.passesCompleted,
          passAccuracy: player.stats.passAccuracy,
          duelsWonRatio: player.stats.duelsWonRatio,
          recoveries: player.stats.recoveries,
          interceptions: player.stats.interceptions,
          possessionLost: player.stats.possessionLost,
        },
        create: {
          playerId: player.id,
          ageGroup: player.ageGroup,
          teams: player.teams,
          totalMatches: player.totalMatches,
          totalMinutes: player.totalMinutes,
          compositeScore: player.compositeScore,
          percentile: player.percentile,
          goals: player.stats.goals,
          assists: player.stats.assists,
          passesCompleted: player.stats.passesCompleted,
          passAccuracy: player.stats.passAccuracy,
          duelsWonRatio: player.stats.duelsWonRatio,
          recoveries: player.stats.recoveries,
          interceptions: player.stats.interceptions,
          possessionLost: player.stats.possessionLost,
        },
      });
  });

    await Promise.all([...percentileUpdates, ...ratingSummaryUpdates]);

  return aggregatedPlayers;
}

