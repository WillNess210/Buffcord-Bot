export interface BBGame {
    id: string;
    date: Date; // scheduled
    finished: boolean;
    status: string;
    homeTeamID: string;
    homeTeamName: string;
    awayTeamID: string;
    awayTeamName: string;
    neutral_site: boolean;
    homeWon: boolean;
    awayPoints: number;
    homePoints: number;
}