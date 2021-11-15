import NBAGSportsRadarApi from "../apis/nba_g/SportsRadarAPI";
import CachedDataManager from "../common/CachedDataManager";


export interface NBAGManagerOptions {
    token: string;
    season: string;
}

export default class NBAGManager {
    private sportsRadarApi: NBAGSportsRadarApi;
    private cachedData: CachedDataManager;

    constructor(options: NBAGManagerOptions) {
        this.cachedData = new CachedDataManager("nbag");
        this.sportsRadarApi = new NBAGSportsRadarApi({
            token: options.token,
            season: options.season,
            cachedData: this.cachedData
        });
    }

    public getAllGLeagueTeams = async (): Promise<NBAGTeam[]> => {
        const rankingsResponse = await this.sportsRadarApi.getNBAGRankings();
        const teams: NBAGTeam[] = [];
        rankingsResponse.conferences.forEach((conference) => {
            conference.divisions.forEach((division) => {
                division.teams.forEach(team => teams.push(team));
            });
        });
        return teams;
    }

    public getTeamRoster = async (team_id: string): Promise<NBAGRosterResponse> => {
        const rosterResponse = await this.sportsRadarApi.getTeamRoster(team_id);
        return rosterResponse;
    }

    public getAllRosters = async (): Promise<NBAGRosterResponse[]> => {
        const allTeams = await this.getAllGLeagueTeams();
        const rosters: NBAGRosterResponse[] = [];
        for(let i = 0; i < allTeams.length; i++) {
            rosters.push(await this.getTeamRoster(allTeams[i].id));
        }
        return rosters;
    }

    public getAllPlayersFromCollege = async(college: string): Promise<NBAGPlayer[]> => {
        const rosters = await this.getAllRosters();
        const players: NBAGPlayer[] = [];
        rosters.forEach((roster) => {
            if(!roster.players) return;
            roster.players.forEach((player) => {
                if(!player || !player.college) return;
                if(player.college === college) {
                    players.push(player);
                }
            });
        });
        return players;
    }
}