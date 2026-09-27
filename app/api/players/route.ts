import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();
    const ageGroup = searchParams.get("ageGroup");
    const sort = searchParams.get("sort") || "desc"; // "asc" | "desc"

    let ratedPlayers = await prisma.playerRatingSummary.findMany({
        include: {
          player: true,
        },
    });

    // Filters
    if (search) {
      ratedPlayers = ratedPlayers.filter((p) =>
        p.player.name.toLowerCase().includes(search)
      );
    }

    if (ageGroup) {
      ratedPlayers = ratedPlayers.filter((p) => p.ageGroup === ageGroup);
    }

    // Sorting
    ratedPlayers.sort((a, b) => {
      return sort === "asc"
        ? a.percentile - b.percentile
        : b.percentile - a.percentile;
    });

    return NextResponse.json({ players: ratedPlayers });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch player ratings", message: error.message },
      { status: 500 }
    );
  }
}