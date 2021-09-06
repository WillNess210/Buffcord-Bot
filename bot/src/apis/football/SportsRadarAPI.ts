import axios from "axios";
import { CollegeInformation } from "../../colleges/model";
import { APIResponse, ResponseStatus } from "../../common/APIResponse";
import CachedDataManager, { CacheStrategies } from "../../common/CachedDataManager";
import { FBSchedule, RosterResponse } from "./models";

export interface FBSportsRadarApiOptions {
    token: string;
    season: string;
    cachedData: CachedDataManager;
}

export default class FBSportsRadarApi {
    private key: string;
    private season: string;
    private api_prefix = "http://api.sportradar.us/ncaafb/trial/v7/en/";
    private cachedData: CachedDataManager;

    constructor (options: FBSportsRadarApiOptions) {
        this.key = options.token;
        this.season = options.season;
        this.cachedData = options.cachedData;
    }

    private getAPISuffix = () => `.json?api_key=${this.key}`;
    private getAPILink = (api_mid: string) => this.api_prefix + api_mid + this.getAPISuffix();
    private fetchAPI = async <R>(api_mid: string): Promise<APIResponse<R>> => {
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

    public getRosterForTeam = (team: CollegeInformation): Promise<RosterResponse> => {
        const api_mid = `teams/${team.fbId}/full_roster`;
        return this.throwAPIErrorIfFailure(
            this.cachedData.getResponse(
                api_mid,
                CacheStrategies.NewDay,
                () => this.fetchAPI<RosterResponse>(api_mid)
            )
        );
    }

    public getScheduleForYear = (year: string): Promise<FBSchedule> => {
        const api_mid = `games/${year}/REG/schedule`;
        return this.throwAPIErrorIfFailure(
            this.cachedData.getResponse(
                "fb" + api_mid,
                CacheStrategies.NewDay,
                () => this.fetchAPI<FBSchedule>(api_mid)
            )
        );
    }
}