import { parse } from 'node-html-parser';
import KenpomAPI from "../apis/kenpom/KenpomAPI"
import { KenpomResult } from '../apis/kenpom/models';
import CachedDataManager from "../common/CachedDataManager";

export default class KenpomManager {
    private kenpomAPI: KenpomAPI;
    private cachedData: CachedDataManager;

    constructor() {
        this.cachedData = new CachedDataManager("kenpom"); 
        this.kenpomAPI = new KenpomAPI({
            cachedData: this.cachedData
        });
    }

    private getKenpomResult = (row: HTMLElement): KenpomResult => {
        const rankElement = row.querySelector('td.hard_left');
        const nameElement = row.querySelector('td.next_left').firstChild;

        return {
            rank: parseInt(rankElement.textContent),
            schoolName: nameElement.textContent
        }
    }

    public getKenpomStandings = async (schools: string[]): Promise<KenpomResult[]> => {
        const page = await this.kenpomAPI.getKenpomPage();
        const root = parse(page);
        const tableBody = root.querySelector('tbody');
        const tableRows = tableBody.querySelectorAll('tr');
        console.log(`Got ${tableRows.length} rows`);
        const results: KenpomResult[] = [];

        for(let i = 0; i < tableRows.length; i++) {
            const row = tableRows[i];
            try {
                const rankElement = row.querySelector('td.hard_left');
                const nameElementParent = row.querySelector('td.next_left');
                if (rankElement && nameElementParent && nameElementParent.childNodes.length > 0) {
                    const nameElement = nameElementParent.firstChild;
                    const kenPomResult = {
                        rank: parseInt(rankElement.textContent),
                        schoolName: nameElement.textContent
                    };
                    if (schools.includes(kenPomResult.schoolName)) {
                        results.push(kenPomResult);
                    }
                }
            } catch (e) {}
        }

        return results;
    }
}