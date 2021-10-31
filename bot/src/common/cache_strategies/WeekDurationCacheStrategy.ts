import { CachedData } from "../CachedDataManager";
import { CacheStrategy } from "./CacheStrategy";

export class WeekDurationCacheStrategy extends CacheStrategy {
    isDataInvalid(data: CachedData): boolean {
        const today = new Date();
        const secondsApart = (today.getTime() - data.fetched_at.getTime())/1000;
        return secondsApart >= 60 * 60 * 24 * 7;
    }
}