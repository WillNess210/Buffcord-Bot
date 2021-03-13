import CBBManager, { ncaamb_season } from "../CBBManager";

export interface BBGameModel {
    id: string;
    date: Date; // scheduled
    finished: boolean;
    status: string;
    homeTeamID: string;
    homeTeamName: string;
    awayTeamID: string;
    awayTeamName: string;
    neutral_site: boolean;
    homeWon: boolean;
    awayPoints: number;
    homePoints: number;
    seasonType: ncaamb_season;
}

const seasonTypePrefixes = {
    [ncaamb_season.REG]: '',
    [ncaamb_season.CT]: '(CONF) ',
    [ncaamb_season.PST]: '(MM) '
}

export class BBGame {
    data: BBGameModel;
    constructor(data: BBGameModel) {
        this.data = data;
    }

    public getID = () => this.data.id;
    public getWinningTeamID = (): string | null => this.data.homePoints > this.data.awayPoints 
        ? this.data.homeTeamID
        : this.data.awayPoints > this.data.homePoints
            ? this.data.awayTeamID
            : null;
    public getDateString = (): string => this.data.date.toDateString();
    public isAtNeutralSite = (): boolean => this.data.neutral_site;
    public noPointsScored = (): boolean => this.data.homePoints === 0 && this.data.awayPoints === 0;

    public getGameTextHeader = (cbbManager: CBBManager) => {
        const teamSplitChar = this.data.neutral_site ? 'vs' : 'at';
        if (this.data.finished) {
            const awayWon: boolean = this.data.awayPoints > this.data.homePoints;
            const awayTeam =
                `${cbbManager.getTeamEmoji(this.data.awayTeamID)}${cbbManager.getTeamShort(this.data.awayTeamID, this.data.awayTeamName)}(${this.data.awayPoints})`;
            const homeTeam = 
            `${cbbManager.getTeamEmoji(this.data.homeTeamID)}${cbbManager.getTeamShort(this.data.homeTeamID, this.data.homeTeamName)}(${this.data.homePoints})`;
            return `${seasonTypePrefixes[this.data.seasonType]}${awayWon ? '**'+awayTeam+'**' : awayTeam} ${teamSplitChar} ${awayWon ? homeTeam : '**'+homeTeam+'**'}`
        } else {
            return `${seasonTypePrefixes[this.data.seasonType]}${cbbManager.getTeamEmoji(this.data.awayTeamID)}${cbbManager.getTeamShort(this.data.awayTeamID, this.data.awayTeamName)} ${teamSplitChar} ${cbbManager.getTeamEmoji(this.data.homeTeamID)}${cbbManager.getTeamShort(this.data.homeTeamID, this.data.homeTeamName)}`;
        }
    }
}