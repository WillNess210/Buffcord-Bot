import axios from "axios";
import { APIResponse, ResponseStatus } from "../../common/APIResponse";
import CachedDataManager, { CacheStrategies } from "../../common/CachedDataManager";
import { NBAGameSummary, NBARoster, NBASchedule, NBAStandingsResonse } from "./models";

export interface NBASportsRadarApiOptions {
    token: string;
    season: string;
    cachedData: CachedDataManager;
}

export default class NBASportsRadarApi {
    private key: string;
    private season: string;
    private api_prefix = "http://api.sportradar.us/nba/trial/v7/en/";
    private cachedData: CachedDataManager;
    private lastFetchTime: number;

    constructor (options: NBASportsRadarApiOptions) {
        this.key = options.token;
        this.season = options.season;
        this.cachedData = options.cachedData;
        this.lastFetchTime = Date.now() - 10000;
    }

    private getAPISuffix = () => `.json?api_key=${this.key}`;
    private getAPILink = (api_mid: string) => this.api_prefix + api_mid + this.getAPISuffix();
    private fetchAPI = async <R>(api_mid: string): Promise<APIResponse<R>> => {
        const api = this.getAPILink(api_mid);
        let resp =  null;

        try {
            while(Date.now() < this.lastFetchTime + 1200){}
            resp = await axios.get(api);
            this.lastFetchTime = Date.now();
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

    private throwAPIErrorIfFailure = async <T>(response: Promise<APIResponse<T>>): Promise<T> => {
        const resp = await response;
        if (resp.error) throw new Error(`API Error`);
        return resp.data;
    }

    public getNBAStandings = async (): Promise<NBAStandingsResonse> => {
        const api_mid = `seasons/${this.season}/REG/standings`;
        return this.throwAPIErrorIfFailure(
            this.cachedData.getResponse(
                "nba" + api_mid,
                CacheStrategies.NewDay,
                () => this.fetchAPI<NBAStandingsResonse>(api_mid)
            )
        );
    }

    public getNBATeamRoster = async(team_id: string) : Promise<NBARoster> => {
        const api_mid=`teams/${team_id}/profile`;

        return this.throwAPIErrorIfFailure(
            this.cachedData.getResponse(
                "nba" + api_mid,
                CacheStrategies.WeekDuration,
                () => this.fetchAPI<NBARoster>(api_mid)
            )
        );
    }

    public getNBASchedule = async(): Promise<NBASchedule> => {
        const api_mid = `games/${this.season}/REG/schedule`;
        return this.throwAPIErrorIfFailure(
            this.cachedData.getResponse(
                "nba" + api_mid,
                CacheStrategies.NewDay,
                () => this.fetchAPI<NBASchedule>(api_mid)
            )
        );
    }

    public getNBAGameSummary = async(game_id: string): Promise<NBAGameSummary> => {
        const api_mid = `games/${game_id}/summary`;
        return this.throwAPIErrorIfFailure(
            this.cachedData.getResponse(
                "nba" + api_mid,
                CacheStrategies.NewDay,
                () => this.fetchAPI<NBAGameSummary>(api_mid)
            )
        );
    }
}