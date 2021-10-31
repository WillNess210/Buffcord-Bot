import { LOCAL_DATABASE } from "..";
import { APIResponse, getAPISuccess, ResponseStatus } from "./APIResponse";
import { CacheStrategy } from "./cache_strategies/CacheStrategy";
import { TwoMinuteDurationCacheStrategy } from "./cache_strategies/CustomDurationCacheStrategy";
import { MinuteDurationCacheStrategy } from "./cache_strategies/MinuteDurationCacheStrategy";
import { NewDayCacheStrategy } from "./cache_strategies/NewDayCacheStrategy";
import { WeekDurationCacheStrategy } from "./cache_strategies/WeekDurationCacheStrategy";

export enum CacheStrategies {
    NewDay = 'newday',
    WeekDuration = 'weekdur',
    MinuteDuration = 'mindur',
    TwoMinuteDuration= '2mindur'
};

const cacheStrategyMap: { [key in CacheStrategies]: CacheStrategy } = {
    [CacheStrategies.NewDay]: new NewDayCacheStrategy(),
    [CacheStrategies.WeekDuration]: new WeekDurationCacheStrategy(),
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
    private prefix: string;

    constructor(prefix: string) {
        this.prefix = prefix;
    }

    public getResponse = async<T>(cache_key: string, cache_strategy: CacheStrategies, fetch_fn: () => Promise<APIResponse<T>>): Promise<APIResponse<T>> => {
        const isCached = await this.isCached(cache_key, cache_strategy);
        if (isCached) {
            const api_success = await getAPISuccess<T>(await this.getData(cache_key));
            return api_success;
        }
        const resp = await fetch_fn();
        if (resp.status === ResponseStatus.FAILURE) return resp;
        this.addCachedData(cache_key, resp.data, cache_strategy);
        return resp;
    }

    private isCached = async (key: string, cache_strategy?: CacheStrategies): Promise<boolean> => {
        const item = await LOCAL_DATABASE.fetchItem<CachedData>(this.prefix + key);
        if (item === undefined || item.data === undefined || item.data === null) return false;
        if (cache_strategy) item.cacheStrategy = cache_strategy;
        item.fetched_at = new Date(item.fetched_at);
        if (this.shouldDeleteData(item)) {
            LOCAL_DATABASE.deleteItem(this.prefix + key);
            return false;
        }
        return true;
    };

    private addCachedData = (key: string, data: any, cacheStrategy: CacheStrategies = CacheStrategies.NewDay) => {
        const newItem = {
            key: key,
            fetched_at: new Date(),
            data: data,
            cacheStrategy: cacheStrategy
        };
        LOCAL_DATABASE.setItem(this.prefix + key, newItem);
    }

    private getData = async <T>(key: string): Promise<T | null> => {
        const isCached = await this.isCached(key);
        if (isCached) {
            const item = (await LOCAL_DATABASE.fetchItem<CachedData>(this.prefix + key));
            return item.data as T;
        }
        return null;
    }

    private shouldDeleteData = (data: CachedData): boolean => {
        return cacheStrategyMap[data.cacheStrategy].isDataInvalid(data);
    }

}