export interface RosterResponse {
    id: string;
    name: string;
    market: string;
    alias: string;
    subdivision: string;
    franchise: Franchise;
    venue: Venue;
    division: DivisionOrConference;
    conference: DivisionOrConference;
    coaches: CoachesEntity[];
    players: PlayersEntity[];
}

export interface Franchise {
    id: string;
    name: string;
}

export interface DivisionOrConference {
    id: string;
    name: string;
    alias: string;
}

export interface CoachesEntity {
    id: string;
    full_name: string;
    first_name: string;
    last_name: string;
    position: string;
}

export interface PlayersEntity {
    id: string;
    name: string;
    jersey: string;
    last_name: string;
    first_name: string;
    abbr_name: string;
    weight: number;
    height: number;
    position: string;
    birth_place: string;
    status: string;
    eligibility: string;
}

export interface FBSchedule {
    id:       string;
    year:     number;
    type:     string;
    name:     string;
    weeks:    Week[];
    _comment: string;
}

export interface Week {
    id:       string;
    sequence: number;
    title:    string;
    games:    Game[];
    bye_week: ByeWeek[];
}

export interface ByeWeek {
    team: Team;
}

export interface Team {
    id:    string;
    name:  string;
    alias: string;
}

export interface ScheduleResponse {
    games: GameResponse[];
    wins: number;
    losses: number;
    gamesToPlay: number;
}

export interface GameResponse {
    weekNumber: number;
    requestTeamIsHome: boolean;
    isByeWeek: boolean;
    gameFinished: boolean;
    homeWon: boolean;
    game?: Game;
}

export interface Game {
    id:            string;
    status:        Status;
    scheduled:     string; // date str
    attendance?:   number;
    entry_mode:    EntryMode;
    coverage:      Coverage;
    sr_id?:        string;
    game_type?:    GameType;
    venue:         Venue;
    home:          Team;
    away:          Team;
    broadcast?:    Broadcast;
    weather?:      Weather;
    scoring?:      Scoring;
    neutral_site?: boolean;
    title?:        string;
}

export interface Broadcast {
    network:    string;
    satellite?: string;
}

export enum Coverage {
    ExtendedBoxscore = "extended_boxscore",
    Full = "full",
}

export enum EntryMode {
    Lde = "LDE",
}

export enum GameType {
    Regular = "regular",
}

export interface Scoring {
    home_points: number;
    away_points: number;
    periods:     Period[];
}

export interface Period {
    period_type:  PeriodType;
    id:           string;
    number:       number;
    sequence:     number;
    home_points?: number;
    away_points?: number;
}

export enum PeriodType {
    Overtime = "overtime",
    Quarter = "quarter",
}

export enum Status {
    Cancelled = "cancelled",
    Closed = "closed",
    Created = "created",
    Inprogress = "inprogress",
    Scheduled = "scheduled",
    TimeTbd = "time-tbd",
}

export interface Venue {
    id:        string;
    name:      string;
    city:      string;
    state:     string;
    country:   Country;
    zip:       string;
    address?:  string;
    capacity:  number;
    surface:   Surface;
    roof_type: RoofType;
}

export enum Country {
    Usa = "USA",
}

export enum RoofType {
    Dome = "dome",
    Outdoor = "outdoor",
    RetractableDome = "retractable_dome",
}

export enum Surface {
    Artificial = "artificial",
    Turf = "turf",
}

export interface Weather {
    condition: Condition;
    humidity:  number;
    temp:      number;
    wind:      Wind;
}

export enum Condition {
    Clear = "Clear",
    Haze = "Haze",
    HazeSmoke = "Haze, Smoke",
    LightRain = "Light Rain",
    Overcast = "Overcast",
    PartlyCloudy = "Partly cloudy",
    RainWithThunderstormMist = "Rain With Thunderstorm, Mist",
    Smoke = "Smoke",
    Sunny = "Sunny",
    ThunderstormInVicinityMist = "Thunderstorm In Vicinity, Mist",
}

export interface Wind {
    speed:     number;
    direction: string;
}
