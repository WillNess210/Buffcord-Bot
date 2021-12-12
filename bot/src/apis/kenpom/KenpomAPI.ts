import axios from "axios";
import { APIResponse, ResponseStatus } from "../../common/APIResponse";
import CachedDataManager, { CacheStrategies } from "../../common/CachedDataManager";

export interface KenpomAPIOptions {
    cachedData: CachedDataManager;
}

export default class KenpomAPI {
    private api = `https://kenpom.com/`;
    private cachedData: CachedDataManager;
    private lastFetchTime: number;

    constructor(options: KenpomAPIOptions) {
        this.cachedData = options.cachedData;
        this.lastFetchTime = Date.now() - 10000;
    }

    private fetchPage = async(): Promise<APIResponse<string>> => {
        let resp =  null;
        try {
            while(Date.now() < this.lastFetchTime + 1200){}
            resp = await axios.get(this.api);
            this.lastFetchTime = Date.now();
        } catch (e) {
            console.log(`404: ${this.api}`);
            return {
                status: ResponseStatus.FAILURE,
                error: `404: ${e}`,
                data: e
            }
        }
        console.log(`${resp.status}: ${this.api}`);
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

    public getKenpomPage = async(): Promise<string> => {
        return this.throwAPIErrorIfFailure(this.cachedData.getResponse(this.api, CacheStrategies.TwoMinuteDuration, () => this.fetchPage()));
    }
}