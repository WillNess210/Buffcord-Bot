import { NBAGameSummary, NBAGameSummaryPlayer, NBAPlayer, NBARoster, NBASchedule, NBATeam } from "../apis/nba/models";
import NBASportsRadarApi from "../apis/nba/SportsRadarAPI";
import CachedDataManager from "../common/CachedDataManager";
import { FBManagerOptions } from "./FBManager";

export interface NBAManagerOptions {
    token: string;
    season: string;
}

export default class NBAManager {
    private sportsRadarApi: NBASportsRadarApi;
    private cachedData: CachedDataManager;

    constructor(options: FBManagerOptions) {
        this.cachedData = new CachedDataManager("nba"); 
        this.sportsRadarApi = new NBASportsRadarApi({
            token: options.token,
            season: options.season,
            cachedData: this.cachedData
        });
    }

    public getAllNBATeams = async (): Promise<NBATeam[]> => {
        const standingsResponse = await this.sportsRadarApi.getNBAStandings();
        const teams: NBATeam[] = [];
        standingsResponse.conferences.forEach((conference) => {
            conference.divisions.forEach((division) => {
                division.teams.forEach((team) => teams.push(team));
            })
        })
        return teams;
    }

    public getRoster = async(team: NBATeam): Promise<NBARoster> => {
        const roster = await this.sportsRadarApi.getNBATeamRoster(team.id);
        roster.players.forEach((player) => player.team_id = roster.id);
        return roster;
    }

    public getRosters = async(): Promise<NBARoster[]> => {
        const allTeams = await this.getAllNBATeams();
        const rosters = [];
        for(let i = 0; i < allTeams.length; i++) {
            rosters.push(await this.getRoster(allTeams[i]));
        }
        return rosters;
    }

    public getAllPlayersFromCollege = async(college: string): Promise<NBAPlayer[]> => {
        const rosters = await this.getRosters();
        const players: NBAPlayer[] = [];
        rosters.forEach((roster) => {
            roster.players.forEach((player) => {
                if (player.college === college) players.push(player);
            });
        });
        return players;
    }

    public getNBASchedule = async(): Promise<NBASchedule> => {
        return await this.sportsRadarApi.getNBASchedule();
    }

    public getNBAGameSummary = async(game_id: string): Promise<NBAGameSummary> => {
        return await this.sportsRadarApi.getNBAGameSummary(game_id);
    }

    public getPlayerSummaryInGame = async(game_id: string, player_id: string, isOnHomeTeam: boolean): Promise<NBAGameSummaryPlayer | undefined> => {
        const game = await this.getNBAGameSummary(game_id);
        const team = isOnHomeTeam ? game.home : game.away;
        const player = team.players.find(player => player.id === player_id);
        return player || undefined;
    }
}