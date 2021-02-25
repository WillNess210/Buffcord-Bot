import axios from "axios";
import { APIResponse, ResponseStatus } from "../common/APIResponse";

export interface SportsDataAPIOptions {
    SPORTS_API_TOKEN: string;
}

export default class SportsDataAPI {
    private key: string;
    private api_prefix = 'https://api.sportsdata.io/v3/cbb/';

    constructor (options: SportsDataAPIOptions) {
        this.key = options.SPORTS_API_TOKEN;
    }

    private getAPISuffix = (key: string) => `?key=${key}`;
    private getAPILink = (api_mid: string) => this.api_prefix + api_mid + this.getAPISuffix(this.key);

    private fetchAPI = async (api_mid: string): Promise<APIResponse<any>> => {
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
}