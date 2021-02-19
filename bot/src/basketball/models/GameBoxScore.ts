import { BBGame } from "./Game";

export interface BBGameBoxScore {
    id: string;
    game: BBGame;
    lead_changes: number;
    clock: string;
    half: number; // 1 or 2BBPlayerBoxScore
    homeTeam: BBTeamBoxScore;
    awayTeam: BBTeamBoxScore;
}

export const createTeamBoxScore = (data: any): BBTeamBoxScore => {
    return {
        id: data.id,
        points: data.points,
        field_goals_made: data.statistics.field_goals_made,
        field_goals_att: data.statistics.field_goats_att,
        field_goals_pct: data.statistics.field_goals_pct,
        three_points_made: data.statistics.three_points_made,
        three_points_att: data.statistics.three_points_att,
        three_points_pct: data.statistics.three_points_pct,
        free_throws_made: data.statistics.free_throws_made,
        free_throws_att: data.statistics.free_throws_att,
        free_throws_pct: data.statistics.free_throws_pct,
        personal_fouls: data.statistics.personal_fouls,
        player_scores: data.players.map((player: any) => createTeamPlayerScore(player)).sort((a: BBPlayerBoxScore, b: BBPlayerBoxScore) => a.points > b.points ? -1 : 1)
    };
}

export interface BBTeamBoxScore {
    id: string;
    points: number;
    field_goals_made: number;
    field_goals_att: number;
    field_goals_pct: number;
    three_points_made: number;
    three_points_att: number;
    three_points_pct: number;
    free_throws_made: number;
    free_throws_att: number;
    free_throws_pct: number;
    personal_fouls: number;
    player_scores: BBPlayerBoxScore[];
}

export const createTeamPlayerScore = (data: any): BBPlayerBoxScore => {
    return {
        id: data.id,
        played: data.played,
        active: data.active,
        starter: data.starter,
        minutes: data.statistics.minutes,
        field_goals_made: data.statistics.field_goals_made,
        field_goals_att: data.statistics.field_goats_att,
        field_goals_pct: data.statistics.field_goals_pct,
        three_points_made: data.statistics.three_points_made,
        three_points_att: data.statistics.three_points_att,
        three_points_pct: data.statistics.three_points_pct,
        free_throws_made: data.statistics.free_throws_made,
        free_throws_att: data.statistics.free_throws_att,
        free_throws_pct: data.statistics.free_throws_pct,
        rebounds: data.statistics.rebounds,
        assists: data.statistics.assists,
        turnovers: data.statistics.turnovers,
        steals: data.statistics.steals,
        blocks: data.statistics.blocks,
        personal_fouls: data.statistics.personal_fouls,
        points: data.statistics.points
    };
}

export interface BBPlayerBoxScore {
    id: string;
    played: boolean;
    active: boolean;
    starter: boolean;
    minutes: string;
    field_goals_made: number;
    field_goals_att: number;
    field_goals_pct: number;
    three_points_made: number;
    three_points_att: number;
    three_points_pct: number;
    free_throws_made: number;
    free_throws_att: number;
    free_throws_pct: number;
    rebounds: number;
    assists: number;
    turnovers: number;
    steals: number;
    blocks: number;
    personal_fouls: number;
    points: number;
}

export type BBPlayerBoxScoreMap = { [id: string]: BBPlayerBoxScore ;};

export const getBoxScorePlayerMap = (box_score: BBGameBoxScore): BBPlayerBoxScoreMap => {
    const map = {};
    box_score.awayTeam.player_scores.forEach((player_score: BBPlayerBoxScore) => map[player_score.id] = player_score);
    box_score.homeTeam.player_scores.forEach((player_score: BBPlayerBoxScore) => map[player_score.id] = player_score);
    return map;
}