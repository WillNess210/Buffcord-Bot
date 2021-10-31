export interface NBAStandingsResonse {
    conferences: {
        divisions: {
            teams: NBATeam[];
        }[];
    }[];
}

export interface NBATeam {
    name: string;
    market: string;
    id: string;
}

export interface NBARoster extends NBATeam {
    players: NBAPlayer[];
}

export interface NBAPlayer {
    full_name: string;
    id: string;
    team_id: string;
    college: string;
}

export interface NBASchedule {
    games: NBAGame[];
}

export interface NBAGame {
    id: string;
    status: string;
    home_points: number;
    away_points: number;
    home: NBAGameTeam;
    away: NBAGameTeam;
}

export interface NBAGameTeam {
    name: string;
    id: string;
}

export interface NBAGameSummary {
    duration: string;
    attendance: number;
    quarter: number;
    scheduled: string;
    home: NBAGameSummaryTeam;
    away: NBAGameSummaryTeam;
}

export interface NBAGameSummaryTeam {
    name: string;
    id: string;
    points: number;
    players: NBAGameSummaryPlayer[];
}

export interface NBAGameSummaryPlayer {
    full_name: string;
    jersey_number: string;
    id: string;
    position: string;
    played: boolean;
    statistics: NBAGameSummaryPlayerStatistics;
}

export interface NBAGameSummaryPlayerStatistics {
    minutes: string;
    field_goals_made: number;
    field_goals_att: number;
    field_goals_pct: number;
    three_points_made: number,
    three_points_att: number,
    three_points_pct: number,
    free_throws_made: number,
    free_throws_att: number,
    free_throws_pct: number,
    offensive_rebounds: number,
    defensive_rebounds: number,
    rebounds: number,
    assists: number,
    turnovers: number,
    steals: number,
    blocks: number,
    assists_turnover_ratio: number,
    personal_fouls: number,
    tech_fouls: number,
    flagrant_fouls: number,
    pls_min: number,
    points: number,
    double_double: boolean,
    triple_double: boolean,
}