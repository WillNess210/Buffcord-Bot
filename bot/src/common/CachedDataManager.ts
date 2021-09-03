import { APIResponse, getAPISuccess, ResponseStatus } from "./APIResponse";
import { CacheStrategy } from "./cache_strategies/CacheStrategy";
import { TwoMinuteDurationCacheStrategy } from "./cache_strategies/CustomDurationCacheStrategy";
import { MinuteDurationCacheStrategy } from "./cache_strategies/MinuteDurationCacheStrategy";
import { NewDayCacheStrategy } from "./cache_strategies/NewDayCacheStrategy";

export enum CacheStrategies {
    NewDay = 'newday',
    MinuteDuration = 'mindur',
    TwoMinuteDuration= '2mindur'
};

const cacheStrategyMap: { [key in CacheStrategies]: CacheStrategy } = {
    [CacheStrategies.NewDay]: new NewDayCacheStrategy(),
    [CacheStrategies.MinuteDuration]: new MinuteDurationCacheStrategy(),
    [CacheStrategies.TwoMinuteDuration]: new TwoMinuteDurationCacheStrategy()
}

export interface CachedData {
    key: string;
    fetched_at: Date;
    data: any;
    cacheStrategy: CacheStrategies
}

export default class CachedDataManager {
    private data: { [key: string]: CachedData; };

    constructor() {
        this.data = {};
    }

    public getResponse = async<T>(cache_key: string, cache_strategy: CacheStrategies, fetch_fn: () => Promise<APIResponse<T>>): Promise<APIResponse<T>> => {
        if (this.isCached(cache_key)) {
            return getAPISuccess(this.getData(cache_key));
        }
        const resp = await fetch_fn();
        if (resp.status === ResponseStatus.FAILURE) return resp;
        this.addCachedData(cache_key, resp.data, cache_strategy);
        return resp;
    }

    private isCached = (key: string): boolean => {
        if (!(key in this.data)) return false;
        if (this.shouldDeleteData(this.data[key])) {
            delete this.data[key];
            return false;
        }
        return true;
    };

    private addCachedData = (key: string, data: any, cacheStrategy: CacheStrategies = CacheStrategies.NewDay) => {
        this.data[key] = {
            key: key,
            fetched_at: new Date(),
            data: data,
            cacheStrategy: cacheStrategy
        };
    }

    private getData = (key: string): any | null => {
        if (this.isCached(key)) {
            return this.data[key].data;
        }
        return null;
    }

    private shouldDeleteData = (data: CachedData): boolean => {
        return cacheStrategyMap[data.cacheStrategy].isDataInvalid(data);
    }

}