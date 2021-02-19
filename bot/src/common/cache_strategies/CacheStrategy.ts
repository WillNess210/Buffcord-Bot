import { CachedData } from "../CachedDataManager";

// All cache strategies should extends this
export class CacheStrategy {
    isDataInvalid(data: CachedData): boolean {
        console.log(`Undefined cache strategy called.`);
        return true;
    }
}