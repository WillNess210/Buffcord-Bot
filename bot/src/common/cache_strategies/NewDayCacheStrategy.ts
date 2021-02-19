import { CachedData } from "../CachedDataManager";
import { CacheStrategy } from "./CacheStrategy";

export class NewDayCacheStrategy extends CacheStrategy {
    isDataInvalid(data: CachedData): boolean {
        const today = new Date();
        return data.fetched_at.getDate() !== today.getDate();
    }
}