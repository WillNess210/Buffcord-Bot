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


export interface GameBoxscore {
    id: string;
    status: string;
    scheduled: string;
    attendance: number;
    entry_mode: string;
    clock: string;
    quarter: number;
    coverage: string;
    sr_id: string;
    neutral_site: boolean;
    game_type: string;
    weather: Weather;
    coin_toss?: (CoinTossEntity)[] | null;
    summary: Summary;
    situation: StartSituationOrEndSituationOrSituation;
    last_event: LastEvent;
    scoring?: (ScoringEntity)[] | null;
    scoring_drives?: (ScoringDrivesEntity)[] | null;
    scoring_plays?: (ScoringPlaysEntity)[] | null;
    _comment: string;
  }

  export interface Wind {
    speed: number;
    direction: string;
  }

  export interface CoinTossEntity {
    home: HomeOrAway;
    away: HomeOrAway;
    quarter: number;
  }

  export interface HomeOrAway {
    outcome: string;
    decision: string;
    direction: string;
  }

  export interface Summary {
    season: Season;
    week: Week;
    venue: Venue;
    home: HomeOrAway1;
    away: HomeOrAway1;
  }

  export interface Season {
    id: string;
    year: number;
    type: string;
    name: string;
  }

  export interface HomeOrAway1 {
    id: string;
    name: string;
    market: string;
    alias: string;
    used_timeouts: number;
    remaining_timeouts: number;
    points: number;
    record: Record;
  }

  export interface Record {
    wins: number;
    losses: number;
    ties: number;
  }

  export interface StartSituationOrEndSituationOrSituation {
    clock: string;
    down: number;
    yfd: number;
    possession: PossessionOrTeam;
    location: Location;
  }

  export interface PossessionOrTeam {
    id: string;
    name: string;
    market: string;
    alias: string;
  }

  export interface Location {
    id: string;
    name: string;
    market: string;
    alias: string;
    yardline: number;
  }

  export interface LastEvent {
    type: string;
    id: string;
    sequence: number;
    clock: string;
    event_type: string;
    description: string;
    created_at: string;
    updated_at: string;
    wall_clock: string;
  }

  export interface ScoringEntity {
    period_type: string;
    id: string;
    number: number;
    sequence: number;
    home_points: number;
    away_points: number;
  }

  export interface ScoringDrivesEntity {
    id: string;
    sequence: number;
    start_reason: string;
    end_reason: string;
    play_count: number;
    duration: string;
    first_downs: number;
    gain: number;
    penalty_yards: number;
    inside_20?: boolean | null;
    scoring_drive: boolean;
    quarter: Quarter;
    team: PossessionOrTeam;
    plays?: (PlaysEntity)[] | null;
  }

  export interface Quarter {
    id: string;
    number: number;
    sequence: number;
  }

  export interface PlaysEntity {
    type: string;
    id: string;
    sequence: number;
    clock: string;
    home_points: number;
    away_points: number;
    play_type: string;
    wall_clock: string;
    description: string;
    fake_punt: boolean;
    fake_field_goal: boolean;
    screen_pass: boolean;
    play_action: boolean;
    run_pass_option: boolean;
    created_at: string;
    updated_at: string;
    start_situation: StartSituationOrEndSituationOrSituation;
    end_situation: StartSituationOrEndSituationOrSituation;
    statistics?: (StatisticsEntity)[] | null;
    details?: (DetailsEntity)[] | null;
    quarter: Quarter;
    goaltogo?: boolean | null;
    scoring_play?: boolean | null;
    scoring_description?: string | null;
    score?: Score | null;
  }

  export interface StatisticsEntity {
    stat_type: string;
    attempt?: number | null;
    complete?: number | null;
    yards?: number | null;
    att_yards?: number | null;
    firstdown?: number | null;
    inside_20?: number | null;
    goaltogo?: number | null;
    player: Player;
    team: PossessionOrTeam;
    target?: number | null;
    reception?: number | null;
    yards_after_catch?: number | null;
    tackle?: number | null;
    category?: string | null;
    down?: number | null;
    penalty?: number | null;
    ast_tackle?: number | null;
    touchdown?: number | null;
    made?: number | null;
    missed?: number | null;
    sack?: number | null;
    sack_yards?: number | null;
    qb_hit?: number | null;
    tlost?: number | null;
    tlost_yards?: number | null;
  }

  export interface Player {
    id: string;
    name: string;
    jersey?: string | null;
    position?: string | null;
  }

  export interface DetailsEntity {
    category: string;
    description?: string | null;
    sequence: number;
    yards?: number | null;
    start_location: StartLocationOrEndLocation;
    end_location: StartLocationOrEndLocation;
    players?: (PlayersEntity | null)[] | null;
    result?: string | null;
    penalty?: Penalty | null;
  }
  export interface StartLocationOrEndLocation {
    alias: string;
    yardline: number;
  }

  export interface Penalty {
    description: string;
    result: string;
    yards: number;
    team: PossessionOrTeam;
  }

  export interface Score {
    sequence: number;
    clock: string;
    points: number;
    home_points: number;
    away_points: number;
    pointsAfterPlay?: PointsAfterPlay | null;
  }

  export interface PointsAfterPlay {
    id: string;
    sequence: number;
    type: string;
  }

  export interface ScoringPlaysEntity {
    type: string;
    id: string;
    sequence: number;
    clock: string;
    home_points: number;
    away_points: number;
    play_type: string;
    scoring_play: boolean;
    goaltogo?: boolean | null;
    wall_clock: string;
    description: string;
    scoring_description: string;
    fake_punt: boolean;
    fake_field_goal: boolean;
    screen_pass: boolean;
    play_action: boolean;
    run_pass_option: boolean;
    created_at: string;
    updated_at: string;
    start_situation: StartSituationOrEndSituationOrSituation;
    end_situation: StartSituationOrEndSituationOrSituation;
    score?: Score1 | null;
    statistics?: (StatisticsEntity1)[] | null;
    details?: (DetailsEntity1)[] | null;
    quarter: Quarter;
  }

  export interface Score1 {
    sequence: number;
    clock: string;
    points: number;
    home_points: number;
    away_points: number;
    pointsAfterPlay?: PointsAfterPlay | null;
  }

  export interface StatisticsEntity1 {
    stat_type: string;
    attempt?: number | null;
    yards?: number | null;
    touchdown?: number | null;
    firstdown?: number | null;
    inside_20?: number | null;
    goaltogo?: number | null;
    player: Player;
    team: PossessionOrTeam;
    made?: number | null;
    att_yards?: number | null;
    missed?: number | null;
    complete?: number | null;
    target?: number | null;
    reception?: number | null;
    yards_after_catch?: number | null;
    down?: number | null;
    category?: string | null;
  }

  export interface DetailsEntity1 {
    category: string;
    description?: string | null;
    sequence: number;
    yards?: number | null;
    start_location: StartLocationOrEndLocation;
    end_location: StartLocationOrEndLocation;
    players?: (PlayersEntity)[] | null;
    result?: string | null;
  }