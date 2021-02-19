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

export enum Schools {
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

export interface SchoolInfo {
    bb_id: string; // sportsradar ID
    school: Schools
    emoji: all_emojis;
    short: string; // short name
    name: string;
}

export type SchoolMap = { [id in Schools]: SchoolInfo; };

export const SCHOOL_MAP: SchoolMap = {
    [Schools.colorado]: {
        bb_id: '9fccbf28-2858-4263-821c-fdefb3c7efa3',
        school: Schools.colorado,
        emoji: all_emojis.colorado,
        name: 'Colorado',
        short: 'COL'
    },
    [Schools.utah]: {
        bb_id: '0d037a5d-827a-44dd-8b70-57603d671d5d',
        school: Schools.utah,
        emoji: all_emojis.utah,
        name: 'Utah',
        short: 'UTE'
    },
    [Schools.oregon]: {
        bb_id: '1da70895-f77f-44ef-b216-d63c02e696eb',
        school: Schools.oregon,
        emoji: all_emojis.oregon,
        name: 'Oregon',
        short: 'ORE'
    },
    [Schools.oregon_state]: {
        bb_id: '532d3874-b4b3-4c5c-acc6-749a6db26c8f',
        school: Schools.oregon_state,
        emoji: all_emojis.oregon_state,
        name: 'Oregon State',
        short: 'OSU'
    },
    [Schools.washington]: {
        bb_id: 'e52c9644-717a-46f4-bf16-aeca000b3b44',
        school: Schools.washington,
        emoji: all_emojis.washington,
        name: 'Washington',
        short: 'WAS'
    },
    [Schools.washington_state]: {
        bb_id: '2d4f0015-adb4-4877-8c15-4a6eed7eed03',
        school: Schools.washington_state,
        emoji: all_emojis.washington_state,
        name: 'Washington STate',
        short: 'WSU'
    },
    [Schools.stanford]: {
        bb_id: '683ab61f-546f-44da-b085-c3a5740554aa',
        school: Schools.stanford,
        emoji: all_emojis.stanford,
        name: 'Stanford',
        short: 'STA'
    },
    [Schools.cal]: {
        bb_id: 'aacdc78d-b7fa-48f6-9686-2fdb8a95030e',
        school: Schools.cal,
        emoji: all_emojis.cal,
        name: 'California',
        short: 'CAL'
    },
    [Schools.usc]: {
        bb_id: '3a000455-de7c-4ca8-880e-abdce7f21da9',
        school: Schools.usc,
        emoji: all_emojis.usc,
        name: 'USC',
        short: 'USC'
    },
    [Schools.ucla]: {
        bb_id: 'ec0d6b67-4b16-4b50-92b2-1a651dae6b0f',
        school: Schools.ucla,
        emoji: all_emojis.ucla,
        name: 'UCLA',
        short: 'UCLA'
    },
    [Schools.arizona]: {
        bb_id: '9b166a3f-e64b-4825-bb6b-92c6f0418263',
        school: Schools.arizona,
        emoji: all_emojis.arizona,
        name: 'Arizona',
        short: 'ARZ'
    },
    [Schools.arizona_state]: {
        bb_id: 'ad4bc983-8d2e-4e6f-a8f9-80840a786c64',
        school: Schools.arizona_state,
        emoji: all_emojis.arizona_state,
        name: 'Arizona State',
        short: 'ASU'
    },
    [Schools.colorado_state]: {
        bb_id: '1a470730-f328-4fb1-8bbf-36a069e4d6b2',
        school: Schools.colorado_state,
        emoji: all_emojis.colorado_state,
        name: 'Colorado State',
        short: 'CSU'
    },
    [Schools.alabama]: {
        bb_id: 'c2104cdc-c83d-40d2-a3cd-df986e29f5d3',
        school: Schools.alabama,
        emoji: all_emojis.alabama,
        name: 'Alabama',
        short: 'ALA'
    }
}