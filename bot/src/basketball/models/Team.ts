import { DiscordColor } from "../../discord/helpers/Color";
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
    schoolInfo?: SchoolInfo;
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
    logo_url: string; // url to team logo
    color: DiscordColor;
    school: Schools
    emoji: all_emojis;
    short: string; // short name
    name: string;
}

export type SchoolMap = { [id in Schools]: SchoolInfo; };
export type SchoolIDMap = { [id: string]: SchoolInfo; };

export const SCHOOL_MAP: SchoolMap = {
    [Schools.colorado]: {
        bb_id: '9fccbf28-2858-4263-821c-fdefb3c7efa3',
        logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Colorado_Buffaloes_logo.svg/200px-Colorado_Buffaloes_logo.svg.png',
        color: new DiscordColor(207, 184, 124),
        school: Schools.colorado,
        emoji: all_emojis.colorado,
        name: 'Colorado',
        short: 'COL'
    },
    [Schools.utah]: {
        bb_id: '0d037a5d-827a-44dd-8b70-57603d671d5d',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Utah_Utes_logo.svg/200px-Utah_Utes_logo.svg.png',
        color: new DiscordColor(204, 0, 0),
        school: Schools.utah,
        emoji: all_emojis.utah,
        name: 'Utah',
        short: 'UTE'
    },
    [Schools.oregon]: {
        bb_id: '1da70895-f77f-44ef-b216-d63c02e696eb',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Oregon_Ducks_logo.svg/150px-Oregon_Ducks_logo.svg.png',
        color: new DiscordColor(254,225,35),
        school: Schools.oregon,
        emoji: all_emojis.oregon,
        name: 'Oregon',
        short: 'ORE'
    },
    [Schools.oregon_state]: {
        bb_id: '532d3874-b4b3-4c5c-acc6-749a6db26c8f',
        logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Oregon_State_Beavers_logo.svg/200px-Oregon_State_Beavers_logo.svg.png',
        color: new DiscordColor(220, 68, 5),
        school: Schools.oregon_state,
        emoji: all_emojis.oregon_state,
        name: 'Oregon State',
        short: 'OSU'
    },
    [Schools.washington]: {
        bb_id: 'e52c9644-717a-46f4-bf16-aeca000b3b44',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Washington_Huskies_logo.svg/150px-Washington_Huskies_logo.svg.png',
        color: new DiscordColor(51, 0, 111),
        school: Schools.washington,
        emoji: all_emojis.washington,
        name: 'Washington',
        short: 'WAS'
    },
    [Schools.washington_state]: {
        bb_id: '2d4f0015-adb4-4877-8c15-4a6eed7eed03',
        logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/07/Washington_State_Cougars_logo.svg/160px-Washington_State_Cougars_logo.svg.png',
        color: new DiscordColor(152, 30, 50),
        school: Schools.washington_state,
        emoji: all_emojis.washington_state,
        name: 'Washington State',
        short: 'WSU'
    },
    [Schools.stanford]: {
        bb_id: '683ab61f-546f-44da-b085-c3a5740554aa',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/118px-Stanford_Cardinal_logo.svg.png',
        color: new DiscordColor(140, 21, 21),
        school: Schools.stanford,
        emoji: all_emojis.stanford,
        name: 'Stanford',
        short: 'STA'
    },
    [Schools.cal]: {
        bb_id: 'aacdc78d-b7fa-48f6-9686-2fdb8a95030e',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/California_Golden_Bears_logo.svg/150px-California_Golden_Bears_logo.svg.png',
        color: new DiscordColor(0, 50, 98),
        school: Schools.cal,
        emoji: all_emojis.cal,
        name: 'California',
        short: 'CAL'
    },
    [Schools.usc]: {
        bb_id: '3a000455-de7c-4ca8-880e-abdce7f21da9',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/USC_Trojans_logo.svg/125px-USC_Trojans_logo.svg.png',
        color: new DiscordColor(153, 27, 30),
        school: Schools.usc,
        emoji: all_emojis.usc,
        name: 'USC',
        short: 'USC'
    },
    [Schools.ucla]: {
        bb_id: 'ec0d6b67-4b16-4b50-92b2-1a651dae6b0f',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/UCLA_Bruins_script.svg/200px-UCLA_Bruins_script.svg.png',
        color: new DiscordColor(45,104,96),
        school: Schools.ucla,
        emoji: all_emojis.ucla,
        name: 'UCLA',
        short: 'UCLA'
    },
    [Schools.arizona]: {
        bb_id: '9b166a3f-e64b-4825-bb6b-92c6f0418263',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Arizona_Wildcats_logo.svg/252px-Arizona_Wildcats_logo.svg.png',
        color: new DiscordColor(0,51,102),
        school: Schools.arizona,
        emoji: all_emojis.arizona,
        name: 'Arizona',
        short: 'ARZ'
    },
    [Schools.arizona_state]: {
        bb_id: 'ad4bc983-8d2e-4e6f-a8f9-80840a786c64',
        logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0a/Arizona_State_Sun_Devils_logo.svg/100px-Arizona_State_Sun_Devils_logo.svg.png',
        color: new DiscordColor(255, 198, 39),
        school: Schools.arizona_state,
        emoji: all_emojis.arizona_state,
        name: 'Arizona State',
        short: 'ASU'
    },
    [Schools.colorado_state]: {
        bb_id: '1a470730-f328-4fb1-8bbf-36a069e4d6b2',
        logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/14/Colorado_State_Rams_logo.svg/175px-Colorado_State_Rams_logo.svg.png',
        color: new DiscordColor(30,77,43),
        school: Schools.colorado_state,
        emoji: all_emojis.colorado_state,
        name: 'Colorado State',
        short: 'CSU'
    },
    [Schools.alabama]: {
        bb_id: 'c2104cdc-c83d-40d2-a3cd-df986e29f5d3',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Alabama_Crimson_Tide_logo.svg/150px-Alabama_Crimson_Tide_logo.svg.png',
        color: new DiscordColor(158,27,50),
        school: Schools.alabama,
        emoji: all_emojis.alabama,
        name: 'Alabama',
        short: 'ALA'
    }
};

export const getSchoolIdMap = (): SchoolIDMap => {
    const SCHOOL_ID_MAP = {};
    Object.values(SCHOOL_MAP).forEach((school: SchoolInfo) => {
        SCHOOL_ID_MAP[school.bb_id] = school;
    });
    return SCHOOL_ID_MAP;
}