import { all_emojis } from "./Emojis";

export interface BBTeamEmoji {
    team: string;
    emoji: string;
};

export interface BBTeam {
    id: string;
    name: string;
    school: string; // raw: market
    conference: string;
    wins: number;
    losses: number;
};

export type BBTeamMap = { [id: string]: BBTeam; };

export const BBTeamsToMap = (teams: BBTeam[]): BBTeamMap => {
    const map = {};
    teams.forEach(team => map[team.id] = team);
    return map;
};

export enum BBSchools {
    colorado,
    utah,
    oregon,
    oregon_state,
    washington,
    washington_state,
    stanford,
    cal,
    usc,
    ucla,
    arizona,
    arizona_state,
    colorado_state,
    alabama
};

export interface BBSchoolInfo {
    id: string; // sportsradar ID
    school: BBSchools
    emoji: all_emojis;
    short: string; // short name
    name: string;
}

export type BBSchoolMap = { [id in BBSchools]: BBSchoolInfo; };

export const BB_SCHOOL_MAP: BBSchoolMap = {
    [BBSchools.colorado]: {
        id: '9fccbf28-2858-4263-821c-fdefb3c7efa3',
        school: BBSchools.colorado,
        emoji: all_emojis.colorado,
        name: 'Colorado',
        short: 'COL'
    },
    [BBSchools.utah]: {
        id: '0d037a5d-827a-44dd-8b70-57603d671d5d',
        school: BBSchools.utah,
        emoji: all_emojis.utah,
        name: 'Utah',
        short: 'UTE'
    },
    [BBSchools.oregon]: {
        id: '1da70895-f77f-44ef-b216-d63c02e696eb',
        school: BBSchools.oregon,
        emoji: all_emojis.oregon,
        name: 'Oregon',
        short: 'ORE'
    },
    [BBSchools.oregon_state]: {
        id: '532d3874-b4b3-4c5c-acc6-749a6db26c8f',
        school: BBSchools.oregon_state,
        emoji: all_emojis.oregon_state,
        name: 'Oregon State',
        short: 'OSU'
    },
    [BBSchools.washington]: {
        id: 'e52c9644-717a-46f4-bf16-aeca000b3b44',
        school: BBSchools.washington,
        emoji: all_emojis.washington,
        name: 'Washington',
        short: 'WAS'
    },
    [BBSchools.washington_state]: {
        id: '2d4f0015-adb4-4877-8c15-4a6eed7eed03',
        school: BBSchools.washington_state,
        emoji: all_emojis.washington_state,
        name: 'Washington STate',
        short: 'WSU'
    },
    [BBSchools.stanford]: {
        id: '683ab61f-546f-44da-b085-c3a5740554aa',
        school: BBSchools.stanford,
        emoji: all_emojis.stanford,
        name: 'Stanford',
        short: 'STA'
    },
    [BBSchools.cal]: {
        id: 'aacdc78d-b7fa-48f6-9686-2fdb8a95030e',
        school: BBSchools.cal,
        emoji: all_emojis.cal,
        name: 'California',
        short: 'CAL'
    },
    [BBSchools.usc]: {
        id: '3a000455-de7c-4ca8-880e-abdce7f21da9',
        school: BBSchools.usc,
        emoji: all_emojis.usc,
        name: 'USC',
        short: 'USC'
    },
    [BBSchools.ucla]: {
        id: 'ec0d6b67-4b16-4b50-92b2-1a651dae6b0f',
        school: BBSchools.ucla,
        emoji: all_emojis.ucla,
        name: 'UCLA',
        short: 'UCLA'
    },
    [BBSchools.arizona]: {
        id: '9b166a3f-e64b-4825-bb6b-92c6f0418263',
        school: BBSchools.arizona,
        emoji: all_emojis.arizona,
        name: 'Arizona',
        short: 'ARZ'
    },
    [BBSchools.arizona_state]: {
        id: 'ad4bc983-8d2e-4e6f-a8f9-80840a786c64',
        school: BBSchools.arizona_state,
        emoji: all_emojis.arizona_state,
        name: 'Arizona State',
        short: 'ASU'
    },
    [BBSchools.colorado_state]: {
        id: '1a470730-f328-4fb1-8bbf-36a069e4d6b2',
        school: BBSchools.colorado_state,
        emoji: all_emojis.colorado_state,
        name: 'Colorado State',
        short: 'CSU'
    },
    [BBSchools.alabama]: {
        id: 'c2104cdc-c83d-40d2-a3cd-df986e29f5d3',
        school: BBSchools.alabama,
        emoji: all_emojis.alabama,
        name: 'Alabama',
        short: 'ALA'
    }
}