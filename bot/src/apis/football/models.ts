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

export interface Venue {
    id: string;
    name: string;
    city: string;
    state: string;
    country: string;
    zip: string;
    address: string;
    capacity: number;
    surface: string;
    roof_type: string;
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
