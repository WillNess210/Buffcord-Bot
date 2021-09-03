import { DiscordEmoji } from "../discord/DiscordEmoji";
import { DiscordColor } from "../discord/helpers/Color";
import { College, CollegeInformation } from "./model";

export type CollegeMap = { [id in College]: CollegeInformation; };

export const COLLEGES: CollegeInformation[] = [
    {
        name: 'Colorado',
        short: 'COL',
        color: new DiscordColor(207, 184, 124),
        college: College.colorado,
        emoji: DiscordEmoji.colorado,
        logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Colorado_Buffaloes_logo.svg/200px-Colorado_Buffaloes_logo.svg.png',
        fbId: 'a18d7cf8-1263-45f2-a938-04032d2f7cf5',
        bbId: '9fccbf28-2858-4263-821c-fdefb3c7efa3'
    }, {
        name: 'Utah',
        short: 'UTE',
        color: new DiscordColor(204, 0, 0),
        college: College.utah,
        emoji: DiscordEmoji.utah,
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Utah_Utes_logo.svg/200px-Utah_Utes_logo.svg.png',
        fbId: '28e1dbb0-1295-42ca-bda1-fddb122aed2b',
        bbId: '0d037a5d-827a-44dd-8b70-57603d671d5d',
    }, {
        name: 'Oregon',
        short: 'ORE',
        color: new DiscordColor(254,225,35),
        college: College.oregon,
        emoji: DiscordEmoji.oregon,
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Oregon_Ducks_logo.svg/150px-Oregon_Ducks_logo.svg.png',
        fbId: '5c218a3b-a013-4037-97b6-603c9502b701',
        bbId: '1da70895-f77f-44ef-b216-d63c02e696eb',
    }, {
        name: 'Oregon State',
        short: 'OSU',
        color: new DiscordColor(220, 68, 5),
        college: College.oregon_state,
        emoji: DiscordEmoji.oregon_state,
        logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/Oregon_State_Beavers_logo.svg/200px-Oregon_State_Beavers_logo.svg.png',
        fbId: '6fddb136-b83b-4f5f-8574-54e5581aeaae',
        bbId: '532d3874-b4b3-4c5c-acc6-749a6db26c8f',
    }, {
        name: 'Washington',
        short: 'WAS',
        color: new DiscordColor(51, 0, 111),
        college: College.washington,
        emoji: DiscordEmoji.washington,
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Washington_Huskies_logo.svg/150px-Washington_Huskies_logo.svg.png',
        fbId: '7293edba-9810-444b-9df1-709c24d1c522',
        bbId: 'e52c9644-717a-46f4-bf16-aeca000b3b44',
    }, {
        name: 'Washington State',
        short: 'WSU',
        color: new DiscordColor(152, 30, 50),
        college: College.washington_state,
        emoji: DiscordEmoji.washington_state,
        logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/07/Washington_State_Cougars_logo.svg/160px-Washington_State_Cougars_logo.svg.png',
        fbId: '1ff5428d-2e8c-4b0f-a5a6-ebff126111a2',
        bbId: '2d4f0015-adb4-4877-8c15-4a6eed7eed03',
    }, {
        name: 'Stanford',
        short: 'STA',
        color: new DiscordColor(140, 21, 21),
        college: College.stanford,
        emoji: DiscordEmoji.stanford,
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/118px-Stanford_Cardinal_logo.svg.png',
        fbId: '7cea6bcb-8ecd-4c92-9b13-31345051ab82',
        bbId: '683ab61f-546f-44da-b085-c3a5740554aa',
    }, {
        name: 'California',
        short: 'CAL',
        color: new DiscordColor(0, 50, 98),
        college: College.cal,
        emoji: DiscordEmoji.cal,
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/California_Golden_Bears_logo.svg/150px-California_Golden_Bears_logo.svg.png',
        fbId: 'eed7f0d6-72e6-4488-8baa-5ee8e3375ba9',
        bbId: 'aacdc78d-b7fa-48f6-9686-2fdb8a95030e',
    }, {
        name: 'USC',
        short: 'USC',
        color: new DiscordColor(153, 27, 30),
        college: College.usc,
        emoji: DiscordEmoji.usc,
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/USC_Trojans_logo.svg/125px-USC_Trojans_logo.svg.png',
        fbId: '8f496f34-14e3-4ca7-958b-53f6da0b74d6',
        bbId: '3a000455-de7c-4ca8-880e-abdce7f21da9',
    }, {
        name: 'UCLA',
        short: 'UCLA',
        color: new DiscordColor(45,104,96),
        college: College.ucla,
        emoji: DiscordEmoji.ucla,
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/UCLA_Bruins_script.svg/200px-UCLA_Bruins_script.svg.png',
        fbId: '398eda2b-ba77-469f-94df-18fd1d9087d8',
        bbId: 'ec0d6b67-4b16-4b50-92b2-1a651dae6b0f',
    }, {
        name: 'Arizona',
        short: 'ARZ',
        color: new DiscordColor(0,51,102),
        college: College.arizona,
        emoji: DiscordEmoji.arizona,
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Arizona_Wildcats_logo.svg/252px-Arizona_Wildcats_logo.svg.png',
        fbId: '9e33183c-7e35-4738-9051-719dd7b32e9c',
        bbId: '9b166a3f-e64b-4825-bb6b-92c6f0418263',
    }, {
        name: 'Arizona State',
        short: 'ASU',
        color: new DiscordColor(255, 198, 39),
        college: College.arizona_state,
        emoji: DiscordEmoji.arizona_state,
        logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0a/Arizona_State_Sun_Devils_logo.svg/100px-Arizona_State_Sun_Devils_logo.svg.png',
        fbId: '00fd8418-0e62-4366-9a2a-d5f72850066c',
        bbId: 'ad4bc983-8d2e-4e6f-a8f9-80840a786c64',
    }, {
        name: 'Colorado State',
        short: 'CSU',
        color: new DiscordColor(30,77,43),
        college: College.colorado_state,
        emoji: DiscordEmoji.colorado_state,
        logo_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/14/Colorado_State_Rams_logo.svg/175px-Colorado_State_Rams_logo.svg.png',
        fbId: '04f8c610-fe83-4b44-a3fc-02394869b81f',
        bbId: '1a470730-f328-4fb1-8bbf-36a069e4d6b2',
    }, {
        name: 'Alabama',
        short: 'ALA',
        color: new DiscordColor(158,27,50),
        college: College.alabama,
        emoji: DiscordEmoji.alabama,
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Alabama_Crimson_Tide_logo.svg/150px-Alabama_Crimson_Tide_logo.svg.png',
        fbId: '19775492-f1eb-4bc5-9e15-078ebd689c0f',
        bbId: 'c2104cdc-c83d-40d2-a3cd-df986e29f5d3',
    }
];

const COLLEGE_MAP = {}
COLLEGES.forEach(college => COLLEGE_MAP[college.college] = college);

export const getCollegeInformation = (college: College) => {
    return COLLEGE_MAP[college];
}