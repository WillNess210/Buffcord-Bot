export default interface BBPlayer {
    id: string;
    team_id: string;
    status: string;
    full_name: string;
    first_name: string;
    last_name: string;
    abbr_name: string;
    height: number;
    weight: number;
    position: string;
    jersey_number: string;
    grade: string; // experience in raw data
};

export type BBPlayerMap = {[id: string]: BBPlayer};

export const BBPlayersToMap = (players: BBPlayer[]): BBPlayerMap => {
    const map = {};
    players.forEach(player => map[player.id] = player);
    return map;
}

export interface BBPlayerEmoji {
    team: string;
    jersey_number: string;
    emoji: string;
};