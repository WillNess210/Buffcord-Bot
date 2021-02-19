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

    public isCached = (key: string): boolean => {
        if (!(key in this.data)) return false;
        if (this.shouldDeleteData(this.data[key])) {
            delete this.data[key];
            return false;
        }
        return true;
    };

    public addCachedData = (key: string, data: any, cacheStrategy: CacheStrategies = CacheStrategies.NewDay) => {
        this.data[key] = {
            key: key,
            fetched_at: new Date(),
            data: data,
            cacheStrategy: cacheStrategy
        };
    }

    public getData = (key: string): any | null => {
        if (this.isCached(key)) {
            return this.data[key].data;
        }
        return null;
    }

    private shouldDeleteData = (data: CachedData): boolean => {
        return cacheStrategyMap[data.cacheStrategy].isDataInvalid(data);
    }

}