import axios from "axios";
import { CollegeInformation } from "../../colleges/model";
import { APIResponse, ResponseStatus } from "../../common/APIResponse";
import { RosterResponse } from "./models";

export interface FBSportsRadarApiOptions {
    token: string;
    season: string;
}

export default class FBSportsRadarApi {
    private key: string;
    private season: string;
    private api_prefix = "http://api.sportradar.us/ncaafb/trial/v7/en/";

    constructor (options: FBSportsRadarApiOptions) {
        this.key = options.token;
        this.season = options.season;
    }

    private getAPISuffix = () => `.json?api_key=${this.key}`;
    private getAPILink = (api_mid: string) => this.api_prefix + api_mid + this.getAPISuffix();
    private fetchAPI = async <R>(api_mid: string): Promise<APIResponse<R>> => {
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

    public getRosterForTeam = (college: CollegeInformation): Promise<APIResponse<RosterResponse>> => {
        const api_mid = `teams/${college.fbId}/full_roster`;
        return this.fetchAPI(api_mid);
    }
}