import { RosterResponse } from "../apis/football/models";
import SportsRadarAPI from "../apis/football/SportsRadarAPI";
import { getCollegeInformation } from "../colleges/info";
import { College, CollegeInformation } from "../colleges/model";
import { APIResponse } from "../common/APIResponse";
import CachedDataManager, { CacheStrategies } from "../common/CachedDataManager";

export interface FBManagerOptions {
    defaultTeam: College;
    token: string;
    season: string;
}

export default class FBManager {
    private sportsRadarApi: SportsRadarAPI;
    private defaultTeam: CollegeInformation;
    private cachedData: CachedDataManager;

    constructor(options: FBManagerOptions) {
        this.sportsRadarApi = new SportsRadarAPI({
            token: options.token,
            season: options.season
        });
        this.defaultTeam = getCollegeInformation(options.defaultTeam);
        this.cachedData = new CachedDataManager(); 
    }

    private throwAPIErrorIfFailure = async <T>(response: Promise<APIResponse<T>>): Promise<T> => {
        const resp = await response;
        if (resp.error) throw new Error(`API Error`);
        return resp.data;
    }

    public getRoster = async(team: CollegeInformation = this.defaultTeam): Promise<RosterResponse> => {
        return this.throwAPIErrorIfFailure(
            this.cachedData.getResponse(
                `roster-${team.college}`,
                CacheStrategies.NewDay,
                () => this.sportsRadarApi.getRosterForTeam(team)
            )
        );
    }
}