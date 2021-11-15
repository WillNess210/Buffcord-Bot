interface NBAGRankingsResponse {
    conferences: NBAGConference[];
}

interface NBAGConference {
    id: string;
    name: string;
    alias: string;
    divisions: NBAGDivision[];
}

interface NBAGDivision {
    id: string;
    name: string;
    alias: string;
    teams: NBAGTeam[];
}

interface NBAGTeam {
    id: string;
    name: string;
    market: string; // location
    reference: string;
    rank: {
        conference: number;
        division: number;
    }
}

interface NBAGRosterResponse {
    id: string;
    name: string;
    market: string;
    alias: string;
    founded: number;
    reference: string;
    players: NBAGPlayer[];
}

interface NBAGPlayer {
    id: string;
    status: string;
    full_name: string;
    abbr_name: string;
    height: number;
    weight: number;
    position: string;
    jersey_number: string;
    college: string;
}

interface NBAGScheduleResponse {
    games: NBAGGame[];
}

interface NBAGGame {
    id: string;
    status: string;
}