import { APIResponse, getAPISuccess, ResponseStatus } from "../common/APIResponse";
import CachedDataManager, { CacheStrategies } from "../common/CachedDataManager";
import { OnSameDay, ReadableDate, ReadableDateShort, SportsDataDate } from "../common/DateHelper";
import SportsRadarAPI, { ncaamb_season } from "./SportsRadarAPI";
import APIBasketball from "./SportsRadarAPI";
import { BBGame } from "./models/Game";
import BBPlayer, { BBPlayerEmoji } from "./models/Player";
import { SchoolInfo, BBTeam, BBTeamEmoji, BBTeamMap, BBTeamsToMap, SchoolIDMap } from "./models/Team";
import { BBGameBoxScore, BBPlayerBoxScore, BBTeamBoxScore } from "./models/GameBoxScore";
import { SEASON_DATES } from "./Dates";

export interface CBBManagerOptions {
    team: SchoolInfo;
    teams: SchoolIDMap;
    season: string;
    SPORTSRADAR_TOKEN: string;
    team_logos: BBTeamEmoji[];
    player_logos: BBPlayerEmoji[];
};

interface DisplayEmojis {
    team_logos: { [key: string]: BBTeamEmoji; };
    player_logos: { [key: number]: BBPlayerEmoji; };
}

export default class CBBManager {
    public currentGame: BBGame | undefined;
    public options: CBBManagerOptions;
    private sportsRadarAPI: SportsRadarAPI;
    private cachedData: CachedDataManager;
    private emojis: DisplayEmojis;

    constructor (options: CBBManagerOptions) {
        this.currentGame = undefined;
        this.options = options;
        this.sportsRadarAPI = new APIBasketball(this.options);
        this.cachedData = new CachedDataManager();
        this.emojis = {
            team_logos: {},
            player_logos: {}
        };
        this.loadEmojis();
    }

    public getAllTeams = async(): Promise<APIResponse<BBTeamMap>> => {
        const cache_key = `all-teams`;
        if (this.cachedData.isCached(cache_key)) {
            return getAPISuccess(this.cachedData.getData(cache_key));
        }
        const resp = await this.sportsRadarAPI.getAllTeams(this.options.teams);
        if (resp.status === ResponseStatus.FAILURE) return {
            status: resp.status,
            error: resp.error,
            data: {}
        };
        const new_resp = {
            status: resp.status,
            error: resp.error,
            data: BBTeamsToMap(resp.data)
        }
        this.cachedData.addCachedData(cache_key, new_resp.data, CacheStrategies.NewDay);
        return new_resp;

    }

    public getPrimaryTeam = async (): Promise<APIResponse<BBTeam>> => {
        const all_teams = await this.getAllTeams();
        if(all_teams.status === ResponseStatus.FAILURE) return {
            status: all_teams.status,
            error: all_teams.error,
            data: null
        };

        return {
            status: ResponseStatus.SUCCESS,
            error: '',
            data: all_teams.data[this.options.team.bb_id]
        };
    }

    public getTeamPlayers = async (team: string = this.options.team.bb_id): Promise<APIResponse<BBPlayer[]>> => {
        const cache_key = `${team}-teamplayers`;
        if (this.cachedData.isCached(cache_key)) {
            return getAPISuccess(this.cachedData.getData(cache_key));
        }
        const resp = await this.sportsRadarAPI.getTeamPlayers(team);
        if (resp.status === ResponseStatus.FAILURE) return resp;
        this.cachedData.addCachedData(cache_key, resp.data, CacheStrategies.NewDay);
        return resp;
    }

    public getAllGames = async (): Promise<APIResponse<BBGame[]>> => {
        const cache_key = `gameschedule`;
        if (this.cachedData.isCached(cache_key)) {
            return getAPISuccess(this.cachedData.getData(cache_key));
        }
        const today = new Date();
        const resp = await this.sportsRadarAPI.getAllGames(ncaamb_season.REG);
        const respCT = today >= SEASON_DATES.CT
            ? await this.sportsRadarAPI.getAllGames(ncaamb_season.CT)
            : {status: ResponseStatus.SUCCESS, error: '', data: []};
        const respPST = today >= SEASON_DATES.PST
            ? await this.sportsRadarAPI.getAllGames(ncaamb_season.PST)
            : {status: ResponseStatus.SUCCESS, error: '', data: []};
        if (resp.status === ResponseStatus.FAILURE || respCT.status === ResponseStatus.FAILURE || respPST.status === ResponseStatus.FAILURE) return resp;
        const all_games = [...resp.data, ...respCT.data, ...respPST.data];
        this.cachedData.addCachedData(cache_key, all_games, CacheStrategies.NewDay);
        // set currentGame
        //this.currentGame = resp.data.find((game: BBGame) => OnSameDay(new Date(), game.date) && (game.homeTeamID === this.options.team_sportsradar || game.awayTeamID === this.options.team_sportsradar));
        this.currentGame = all_games.find((game: BBGame): boolean => {
            if (game.data.homeTeamID === this.options.team.bb_id || game.data.awayTeamID === this.options.team.bb_id) {
                return OnSameDay(game.data.date, new Date());
            }
            return false;
        });
        if (this.currentGame) console.log(`Set currentGame to: ${this.currentGame.data.awayTeamName} ${this.currentGame.data.awayTeamID} ${this.currentGame.data.homeTeamName} ${this.currentGame.data.homeTeamID} ${ReadableDate(this.currentGame.data.date || new Date())}`);
        return {
            status: ResponseStatus.SUCCESS,
            error: '',
            data: all_games
        };
    }

    public getTeamSchedule = async (team: string = this.options.team.bb_id): Promise<APIResponse<BBGame[]>> => {
        const resp = await this.getAllGames();
        if (resp.status === ResponseStatus.FAILURE) return resp;
        const games = resp.data.filter(game => game.data.homeTeamID === team || game.data.awayTeamID === team);
        return {
            status: resp.status,
            error: resp.error,
            data: games
        };
    } 

    public getGameBoxScore = async (): Promise<APIResponse<BBGameBoxScore>> => {
        // prefetch (ensure we have currentGame loaded)
        await this.getAllGames();
        await this.getAllTeams();
        // if there's no current game, return empty
        if (!this.currentGame) return {
            status: ResponseStatus.FAILURE,
            data: null,
            error: `${this.options.team.name} does not have a game today.`
        };
        // fetch
        const cache_key = `boxscore`;
        if (this.cachedData.isCached(cache_key)) {
            return getAPISuccess(this.cachedData.getData(cache_key));
        }
        const resp = await this.sportsRadarAPI.getGameBoxScore(this.currentGame);
        if (resp.status === ResponseStatus.FAILURE) return resp;
        this.cachedData.addCachedData(cache_key, resp.data, CacheStrategies.TwoMinuteDuration);
        return resp;
    }

    public getTeamAsTextRow = (team: BBTeam): string => {
        return `${this.getTeamEmoji(team.id)}${team.school} ${team.name} (${team.wins}-${team.losses})`;
    }

    public getPlayerAsTextRow = (player: BBPlayer): string => {
        return `${this.getPlayerEmoji(player)}**${player.jersey_number}**. **${player.full_name}** | ${player.grade} ${player.position}`;
    }

    public getBoxScoreTeamHeader = (team: BBTeam, score: BBTeamBoxScore): string => {
        return `${this.getTeamEmoji(team.id)} **${team.school} ${team.name}** ${score.points}pts ${score.free_throws_pct}FT% ${score.field_goals_pct}FG% ${score.three_points_pct}3P%`;
    }

    public getBoxScoreAsTextRow = (player: BBPlayer, score: BBPlayerBoxScore) => {
        const player_prefix = this.getPlayerAsTextRow(player);
        return player_prefix + (score !== undefined
            ? `: ${score.points}pts ${score.rebounds}rb ${score.assists}as`
            : ` has no data recorded yet.`);
    }

    public getPlayerEmoji = (player: BBPlayer): string => {
        return player.team_id + player.jersey_number in this.emojis.player_logos 
            ? this.emojis.player_logos[player.team_id + player.jersey_number].emoji
            : this.getTeamEmoji(player.team_id);
    }

    public getTeamEmoji = (team_id: string): string => {
        return team_id in this.emojis.team_logos
            ? this.emojis.team_logos[team_id].emoji
            : '';
    }

    public getTeamShort = (team_id: string, backup: string): string => this.options.teams[team_id] ? this.options.teams[team_id].short : backup;

    private loadEmojis = () => {
        this.options.team_logos.forEach((emoji: BBTeamEmoji) => this.emojis.team_logos[emoji.team] = emoji);
        this.options.player_logos.forEach((emoji: BBPlayerEmoji) => this.emojis.player_logos[emoji.team + emoji.jersey_number] = emoji);
    }
};