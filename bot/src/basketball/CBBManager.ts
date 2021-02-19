import { APIResponse, getAPISuccess, ResponseStatus } from "../common/APIResponse";
import CachedDataManager, { CacheStrategies } from "../common/CachedDataManager";
import { OnSameDay, ReadableDate, SportsDataDate } from "../common/DateHelper";
import SportsRadarAPI from "./SportsRadarAPI";
import APIBasketball from "./SportsRadarAPI";
import { BBGame } from "./models/Game";
import BBPlayer, { BBPlayerEmoji } from "./models/Player";
import { SchoolInfo, SchoolMap, BBTeam, BBTeamEmoji, BBTeamMap, BBTeamsToMap } from "./models/Team";
import { BBGameBoxScore, BBPlayerBoxScore, BBTeamBoxScore } from "./models/GameBoxScore";

export interface CBBManagerOptions {
    team: SchoolInfo;
    teams: SchoolMap;
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
    private options: CBBManagerOptions;
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
        const resp = await this.sportsRadarAPI.getAllTeams();
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
        const resp = await this.sportsRadarAPI.getAllGames();
        if (resp.status === ResponseStatus.FAILURE) return resp;
        this.cachedData.addCachedData(cache_key, resp.data, CacheStrategies.NewDay);
        // set currentGame
        //this.currentGame = resp.data.find((game: BBGame) => OnSameDay(new Date(), game.date) && (game.homeTeamID === this.options.team_sportsradar || game.awayTeamID === this.options.team_sportsradar));
        this.currentGame = resp.data.find((game: BBGame): boolean => {
            if (game.homeTeamID === this.options.team.bb_id || game.awayTeamID === this.options.team.bb_id) {
                return OnSameDay(game.date, new Date());
            }
            return false;
        });
        if (this.currentGame) console.log(`Set currentGame to: ${this.currentGame.awayTeamName} ${this.currentGame.awayTeamID} ${this.currentGame.homeTeamName} ${this.currentGame.homeTeamID} ${ReadableDate(this.currentGame.date || new Date())}`);
        return resp;
    }

    public getTeamSchedule = async (team: string = this.options.team.bb_id): Promise<APIResponse<BBGame[]>> => {
        const resp = await this.getAllGames();
        if (resp.status === ResponseStatus.FAILURE) return resp;
        const games = resp.data.filter(game => game.homeTeamID === team || game.awayTeamID === team);
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

    public getGameAsTextRow = (game: BBGame): string => {
        const teamSplitChar = game.neutral_site ? 'vs' : 'at';
        const rowPrefix = `${ReadableDate(game.date)}: `;
        if (game.finished) {
            const awayWon: boolean = game.awayPoints > game.homePoints;
            const awayTeam =
                `${this.getTeamEmoji(game.awayTeamID)}${game.awayTeamName}(${game.awayPoints})`;
            const homeTeam = 
            `${this.getTeamEmoji(game.homeTeamID)}${game.homeTeamName}(${game.homePoints})`;
            return rowPrefix + `${awayWon ? '**'+awayTeam+'**' : awayTeam} ${teamSplitChar} ${awayWon ? homeTeam : '**'+homeTeam+'**'}`
        } else {
            return rowPrefix + `${this.getTeamEmoji(game.awayTeamID)}${game.awayTeamName} ${teamSplitChar} ${this.getTeamEmoji(game.homeTeamID)}${game.homeTeamName}`;
        }
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

    private getPlayerEmoji = (player: BBPlayer): string => {
        return player.team_id + player.jersey_number in this.emojis.player_logos 
            ? this.emojis.player_logos[player.team_id + player.jersey_number].emoji
            : this.getTeamEmoji(player.team_id);
    }

    private getTeamEmoji = (team_id: string): string => {
        return team_id in this.emojis.team_logos
            ? this.emojis.team_logos[team_id].emoji
            : '';
    }

    private loadEmojis = () => {
        this.options.team_logos.forEach((emoji: BBTeamEmoji) => this.emojis.team_logos[emoji.team] = emoji);
        this.options.player_logos.forEach((emoji: BBPlayerEmoji) => this.emojis.player_logos[emoji.team + emoji.jersey_number] = emoji);
    }
};