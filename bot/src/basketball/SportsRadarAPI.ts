import axios from "axios";
import { APIResponse, ResponseStatus } from "../common/APIResponse";
import { ncaamb_season } from "./CBBManager";
import { BBGame, BBGameModel } from "./models/Game";
import { BBGameBoxScore, createTeamBoxScore } from "./models/GameBoxScore";
import BBPlayer from "./models/Player";
import { BBTeam, SchoolIDMap } from "./models/Team";

export interface SportsRadarAPIOptions {
    SPORTSRADAR_TOKEN: string;
    season: string;
}

export default class SportsRadarAPI {
    private key: string;
    private season: string;
    private api_prefix = 'http://api.sportradar.us/ncaamb/trial/v7/en/';

    constructor (options: SportsRadarAPIOptions) {
        this.key = options.SPORTSRADAR_TOKEN;
        this.season = options.season;
    }

    private getAPISuffix = () => `.json?api_key=${this.key}`;
    private getAPILink = (api_mid: string) => this.api_prefix + api_mid + this.getAPISuffix();

    public getTeamPlayers = async (team: string): Promise<APIResponse<BBPlayer[]>> => {
        const api = `teams/${team}/profile`;
        const resp = (await this.fetchAPI(api) as APIResponse<any>);
        if (resp.status === ResponseStatus.SUCCESS) {
            const all_players: BBPlayer[] = [];
            (resp.data.players as any[]).forEach(player => {
                all_players.push({
                    id: player.id,
                    team_id: resp.data.id,
                    status: player.status,
                    full_name: player.full_name,
                    first_name: player.first_name,
                    last_name: player.last_name,
                    abbr_name: player.abbr_name,
                    height: player.height,
                    weight: player.weight,
                    position: player.position,
                    jersey_number: player.jersey_number,
                    grade: player.experience
                } as BBPlayer);
            });
            return {
                status: resp.status,
                error: resp.error,
                data: all_players.sort((a: BBPlayer, b: BBPlayer): number => {
                    return parseInt(a.jersey_number) < parseInt(b.jersey_number) ? -1 : 1;
                })
            };
        }
        return {
            status: resp.status,
            error: resp.error,
            data: []
        }
    }

    public getAllGames = async (season_type: ncaamb_season): Promise<APIResponse<BBGame[]>> => {
        const api = `games/${this.season}/${season_type}/schedule`;
        const resp = (await this.fetchAPI(api) as APIResponse<any>);
        if (resp.status === ResponseStatus.SUCCESS) {
            const all_games: BBGame[] = [];
            (resp.data.games as any[]).forEach(game => {
                if(game.status !== 'cancelled' && game.status !== 'postponed')
                    all_games.push(new BBGame({
                        id: game.id,
                        date: new Date(game.scheduled),
                        finished: game.status === 'closed',
                        status: game.status,
                        homeTeamID: game.home.id,
                        homeTeamName: game.home.name,
                        awayTeamID: game.away.id,
                        awayTeamName: game.away.name,
                        neutral_site: game.neutral_site || false,
                        homeWon: 'home_points' in game && game.home_points >= game.away_points,
                        homePoints: game.home_points || 0,
                        awayPoints: game.away_points || 0,
                        seasonType: season_type
                    } as BBGameModel));
            });
            const sorted_games: BBGame[] = all_games
                .sort((a: BBGame, b: BBGame): number => {
                    return a.data.date.getTime() < b.data.date.getTime() ? -1 : 1;
                });
            return {
                status: resp.status,
                error: resp.error,
                data: sorted_games
            }
        }
        return {
            status: resp.status,
            error: resp.error,
            data: []
        }
    }

    public getGameBoxScore = async(game: BBGame): Promise<APIResponse<BBGameBoxScore>> => {
        const api = `games/${game.getID()}/summary`;
        const resp = (await this.fetchAPI(api)) as APIResponse<any>;
        if (resp.status === ResponseStatus.SUCCESS) {
            const gameBoxScore: BBGameBoxScore = {
                id: resp.data.id,
                game: game,
                lead_changes: resp.data.lead_changes,
                clock: resp.data.clock,
                half: resp.data.half,
                homeTeam: createTeamBoxScore(resp.data.home),
                awayTeam: createTeamBoxScore(resp.data.away)
            };
            return {
                status: resp.status,
                error: resp.error,
                data: gameBoxScore
            }
        }
        return {
            status: resp.status,
            error: resp.error,
            data: null
        };
    }

    public getAllTeams = async (schools: SchoolIDMap): Promise<APIResponse<BBTeam[]>> => {
        const api = `seasons/${this.season}/REG/standings`;
        const resp = (await this.fetchAPI(api)) as APIResponse<any>;
        if (resp.status === ResponseStatus.SUCCESS) {
            const all_teams = [];
            (resp.data.conferences as any[]).forEach(conference => {
                (conference.teams as any[]).forEach(team => {
                    all_teams.push({
                        id: team.id,
                        name: team.name,
                        school: team.market,
                        conference: conference.alias,
                        wins: team.wins,
                        losses: team.losses,
                        schoolInfo: team.id in schools && schools[team.id]
                    } as BBTeam);
                });
            });
            return {
                status: resp.status,
                error: resp.error,
                data: all_teams
            }
        }
        return {
            status: resp.status,
            error: resp.error,
            data: []
        }
    }

    private fetchAPI = async (api_mid: string): Promise<APIResponse<any>> => {
        const api = this.getAPILink(api_mid);
        let resp =  null;

        try {
            resp = await axios.get(api);
        } catch (e) {
            console.log(`404: ${api}`);
            return {
                status: ResponseStatus.FAILURE,
                error: `404: ${e}`,
                data: e
            }
        }
        console.log(`${resp.status}: ${api}`);
        if (resp.status === 200) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return {
                status: ResponseStatus.SUCCESS,
                error: '',
                data: resp.data
            };
        }
        return {
            status: ResponseStatus.FAILURE,
            error: `${resp.status}: ${resp.statusText}`,
            data: resp.data
        };
    }
}