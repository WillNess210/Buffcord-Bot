import { EmbedField } from "discord.js";
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

const blankStats = {
    minutes: 0,
    field_goals_made: 0,
    field_goals_att: 0,
    field_goals_pct: 0,
    three_points_made: 0,
    three_points_att: 0,
    three_points_pct: 0,
    free_throws_made: 0,
    free_throws_att: 0,
    free_throws_pct: 0,
    personal_fouls: 0,
}

export const createTeamBoxScore = (data: any): BBTeamBoxScore => {
    const stats = data.statistics || blankStats;
    return {
        id: data.id,
        points: data.points,
        field_goals_made: stats.field_goals_made,
        field_goals_att: stats.field_goals_att,
        field_goals_pct: stats.field_goals_pct,
        three_points_made: stats.three_points_made,
        three_points_att: stats.three_points_att,
        three_points_pct: stats.three_points_pct,
        free_throws_made: stats.free_throws_made,
        free_throws_att: stats.free_throws_att,
        free_throws_pct: stats.free_throws_pct,
        personal_fouls: stats.personal_fouls,
        player_scores: data.players 
            ? data.players
                .map((player: any) => createTeamPlayerScore(player))
                .sort((a: BBPlayerBoxScore, b: BBPlayerBoxScore) => {
                    const a_actions = a.points + a.assists + a.rebounds;
                    const b_actions = b.points + b.assists + b.rebounds;
                    return (a_actions > b_actions) ? -1 : 1;
                })
                : []
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
    const statistics = data.statistics || blankStats
    return {
        id: data.id,
        played: data.played,
        active: data.active,
        starter: data.starter,
        minutes: statistics.minutes,
        field_goals_made: statistics.field_goals_made,
        field_goals_att: statistics.field_goats_att,
        field_goals_pct: statistics.field_goals_pct,
        three_points_made: statistics.three_points_made,
        three_points_att: statistics.three_points_att,
        three_points_pct: statistics.three_points_pct,
        free_throws_made: statistics.free_throws_made,
        free_throws_att: statistics.free_throws_att,
        free_throws_pct: statistics.free_throws_pct,
        rebounds: statistics.rebounds,
        assists: statistics.assists,
        turnovers: statistics.turnovers,
        steals: statistics.steals,
        blocks: statistics.blocks,
        personal_fouls: statistics.personal_fouls,
        points: statistics.points
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