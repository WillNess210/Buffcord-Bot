import storage from 'node-persist';

export default class LocalDatabase {
    constructor() {
        storage.init({ dir: "/bot/node-persist-data"});
    }

    public async fetchItem<T> (key: string): Promise<T | undefined> {
        return storage.getItem(key);
    }

    public async setItem (key: string, value: any): Promise<void> {
        await storage.setItem(key, value);    
    }

    public async deleteItem (key: string): Promise<void> {
        await storage.removeItem(key);
    }
}