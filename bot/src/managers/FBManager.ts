import { ByeWeek, FBSchedule, Game, GameResponse, PlayersEntity, RosterResponse, Week } from "../apis/football/models";
import SportsRadarAPI from "../apis/football/SportsRadarAPI";
import { getCollegeInformation, getCollegeInformationFromFbID } from "../colleges/info";
import { College, CollegeInformation } from "../colleges/model";
import { APIResponse, getAPISuccess } from "../common/APIResponse";
import CachedDataManager, { CacheStrategies } from "../common/CachedDataManager";

export interface FBManagerOptions {
    token: string;
    season: string;
}

export default class FBManager {
    private sportsRadarApi: SportsRadarAPI;
    private cachedData: CachedDataManager;

    constructor(options: FBManagerOptions) {
        this.cachedData = new CachedDataManager(); 
        this.sportsRadarApi = new SportsRadarAPI({
            token: options.token,
            season: options.season,
            cachedData: this.cachedData
        });
    }

    public getPositionsForTeam = async(
        team: CollegeInformation
    ): Promise<string[]> => {
        const teamPlayers = await this.getRosterForTeam(team);
        return teamPlayers
            .map((a: PlayersEntity) => a.position.toUpperCase())
            .filter((position: string, index: number, ar: string[]) => ar.indexOf(position) === index)
            .sort();
    }

    public getRosterForTeam = async(
        team: CollegeInformation,
        position?: string, // include if want to filter to specific position
        ): Promise<PlayersEntity[]> => {
        const rosterResponse = await this.sportsRadarApi.getRosterForTeam(team);
        const players = rosterResponse.players
            .sort((a: PlayersEntity, b:PlayersEntity) => parseInt(a.jersey) > parseInt(b.jersey) ? 1 : -1);
        if (position) {
            return players.filter((player: PlayersEntity) => player.position === position);
        }
        return players;
    }

    public getTeamName = async(
        team: CollegeInformation,
    ): Promise<string> => {
        const rosterResponse = await this.sportsRadarApi.getRosterForTeam(team);
        return rosterResponse.name;
    }

    public getYear = async(): Promise<string> => {   
        return (await this.cachedData.getResponse(
            `year`,
            CacheStrategies.NewDay,
            async () => getAPISuccess(new Date().getFullYear() + ''),
        )).data;
    }
    
    public getScheduleForTeam = async(
        team: CollegeInformation
    ): Promise<GameResponse[]> => {
        const scheduleResponse = await this.sportsRadarApi.getScheduleForYear(await this.getYear());
        const games: GameResponse[] = [];
        scheduleResponse.weeks.forEach((week: Week, weekNumber: number) => {
            week.games.forEach((game: Game) => {
                if (game.home.id === team.fbId || game.away.id === team.fbId) {
                    games.push({
                        weekNumber,
                        requestTeamIsHome: game.home.id === team.fbId,
                        game,
                        isByeWeek: false
                    });
                }
            });
            week.bye_week.forEach((bye: ByeWeek) => {
                if (bye.team.id === team.fbId) {
                    games.push({
                        weekNumber,
                        requestTeamIsHome: true,
                        isByeWeek: true
                    })
                }
            })
        });
        return games;
    }

    public getEmojiForTeamId = (teamId: string) => {
        const team = getCollegeInformationFromFbID(teamId);
        return team && team.emoji ? team.emoji : ':football:';
    }
}