


export interface Player {
  id: string;
  name: string;
  percentile: number;
  ageGroup: string;
  playerId: string;
  player: {
    id: string;
    name: string;
  };
}

export interface Match {
  id: string;
  matchDate: string;
  competition: string;
}

export interface Appearance {
  id: string;
  matchId: string;
  team: string;
  opponent: string;
  minutesPlayed: number;
  position: string;
  touches: number;
  passesCompleted: number;
  passesAttempted: number;
  shots: number;
  shotsOnTarget: number;
  tackles: number;
  interceptions: number;
  match: Match;
}

export interface PlayerDetail {
  id: string;
  name: string;
  percentile: number;
  ageGroup: string;
  appearances: Appearance[];
}
