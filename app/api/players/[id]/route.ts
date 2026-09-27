import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const playerId = id;

    console.log("....reached")
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      include: {
        appearances: {
          include: { match: true },
          orderBy: { match: { matchDate: "desc" } },
        },
      },
    });
    console.log("Player details fetched:", player);

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    return NextResponse.json({
      player
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch player details", message: error.message },
      { status: 500 }
    );
  }
}
