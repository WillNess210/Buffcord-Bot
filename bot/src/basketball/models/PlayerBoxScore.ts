export interface PlayerBoxScore {
    PlayerID: number;
    Minutes: number;
    FieldGoalsMade: number;
    FieldGoalsAttempted: number;
    FieldGoalsPercentage: number;
    ThreePointersMade: number;
    ThreePointersAttempted: number;
    ThreePointersPercentage: number;
    Assists: number;
    Points: number;
    BlockedShots: number;
    Rebounds: number;
}

export type PlayerBoxScoreMap = { [PlayerID: number]: PlayerBoxScore | undefined; }

export const boxScoresToMap = (boxScores: PlayerBoxScore[]): PlayerBoxScoreMap => {
    const map: PlayerBoxScoreMap = {};
    boxScores.forEach((score: PlayerBoxScore) => map[score.PlayerID] = score);
    return map;
}