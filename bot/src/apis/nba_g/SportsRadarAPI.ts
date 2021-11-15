import axios from "axios";
import { APIResponse, ResponseStatus } from "../../common/APIResponse";
import CachedDataManager, { CacheStrategies } from "../../common/CachedDataManager";

export interface NBAGSportsRadarApiOptions {
    token: string;
    season: string;
    cachedData: CachedDataManager;
}

export default class NBAGSportsRadarApi {
    private key: string;
    private season: string;
    private api_prefix = "http://api.sportradar.us/nbdl/trial/v7/en/";
    private cachedData: CachedDataManager;
    private lastFetchTime: number;

    constructor (options: NBAGSportsRadarApiOptions) {
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

    public getNBAGRankings = async(): Promise<NBAGRankingsResponse> => {
        const api_mid = `seasons/${this.season}/REG/rankings`;
        return this.throwAPIErrorIfFailure(
            this.cachedData.getResponse(
                "nbag" + api_mid,
                CacheStrategies.NewDay,
                () => this.fetchAPI<NBAGRankingsResponse>(api_mid)
            )
        )
    }

    public getTeamRoster = async(team_id: string): Promise<NBAGRosterResponse> => {
        const api_mid = `teams/${team_id}/profile`;
        return this.throwAPIErrorIfFailure(
            this.cachedData.getResponse(
                "nbag" + api_mid,
                CacheStrategies.WeekDuration,
                () => this.fetchAPI<NBAGRosterResponse>(api_mid)
            )
        )
    }
}