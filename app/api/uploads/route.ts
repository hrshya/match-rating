import { NextResponse } from "next/server";
import Papa from "papaparse";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { calculatePlayerRatings } from "@/lib/rating";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();
    const parseResult = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });

    const rows = parseResult.data;

    const existingPlayers = await prisma.player.findMany({
      select: { id: true, name: true }
    });

    const playerMap = new Map<string, string>();
    existingPlayers.forEach((p) => playerMap.set(p.name, p.id));

    const newPlayers: any[] = [];
    const newMatches = new Map<string, any>();
    const newAppearances: any[] = [];

    for (const row of rows) {
      if (!row.match_id || !row.player_name) continue;

      if (!newMatches.has(row.match_id)) {
        newMatches.set(row.match_id, {
          id: row.match_id,
          matchDate: new Date(row.match_date),
          competition: row.competition || "Unknown",
          ageGroup: row.age_group || "Unknown",
          homeTeam: row.home_team || "",
          awayTeam: row.away_team || "",
        });
      }

      let playerId = playerMap.get(row.player_name);
      if (!playerId) {
        playerId = crypto.randomUUID();
        playerMap.set(row.player_name, playerId);
        newPlayers.push({
          id: playerId,
          name: row.player_name,
        });
      }

      newAppearances.push({
        playerId: playerId,
        matchId: row.match_id,
        team: row.team || "",
        opponent: row.opponent || "",
        venue: row.venue || "",
        position: row.position || "CM",
        minutesPlayed: parseInt(row.minutes_played || "0", 10),
        goalsFor: parseInt(row.goals_for || "0", 10),
        goalsAgainst: parseInt(row.goals_against || "0", 10),
        touches: parseInt(row.touches || "0", 10),
        passesAttempted: parseInt(row.passes_attempted || "0", 10),
        passesCompleted: parseInt(row.passes_completed || "0", 10),
        progressivePasses: parseInt(row.progressive_passes || "0", 10),
        crosses: parseInt(row.crosses || "0", 10),
        dribblesAttempted: parseInt(row.dribbles_attempted || "0", 10),
        dribblesCompleted: parseInt(row.dribbles_completed || "0", 10),
        shots: parseInt(row.shots || "0", 10),
        shotsOnTarget: parseInt(row.shots_on_target || "0", 10),
        goals: parseInt(row.goals || "0", 10),
        assists: parseInt(row.assists || "0", 10),
        possessionLost: parseInt(row.possession_lost || "0", 10),
        duelsWon: parseInt(row.duels_won || "0", 10),
        duelsLost: parseInt(row.duels_lost || "0", 10),
        aerialDuelsWon: parseInt(row.aerial_duels_won || "0", 10),
        aerialDuelsLost: parseInt(row.aerial_duels_lost || "0", 10),
        tackles: parseInt(row.tackles || "0", 10),
        interceptions: parseInt(row.interceptions || "0", 10),
        recoveries: parseInt(row.recoveries || "0", 10),
        clearances: parseInt(row.clearances || "0", 10),
        foulsCommitted: parseInt(row.fouls_committed || "0", 10),
        foulsWon: parseInt(row.fouls_won || "0", 10),
        yellowCards: parseInt(row.yellow_cards || "0", 10),
        redCards: parseInt(row.red_cards || "0", 10),
      });
    }

    if (newPlayers.length > 0) {
      await prisma.player.createMany({
        data: newPlayers,
        skipDuplicates: true,
      });
    }

    if (newMatches.size > 0) {
      await prisma.match.createMany({
        data: Array.from(newMatches.values()),
        skipDuplicates: true,
      });
    }

    if (newAppearances.length > 0) {
      await prisma.appearance.createMany({
        data: newAppearances,
        skipDuplicates: true,
      });
    }

    await calculatePlayerRatings();

    return NextResponse.json({ success: true, processedRows: rows.length });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
