import { config } from 'dotenv';
import CBBManager, { CBBManagerOptions } from './basketball/CBBManager';
import { DiscordBot, DiscordBotOptions } from './discord/DiscordBot';
import { BoxScoreHandler } from './discord/message_handlers/basketball/BoxScoreHandler';
import { GameHandler } from './discord/message_handlers/basketball/GameHandler';
import { GamesHandler } from './discord/message_handlers/basketball/GamesHandler';
import { ConfHandler } from './discord/message_handlers/basketball/ConfHandler';
import { PingHandler } from './discord/message_handlers/PingHandler';
import { PlayersHandler } from './discord/message_handlers/basketball/PlayersHandler';
import { HelpHandler } from './discord/message_handlers/HelpHandler';
import { getSchoolIdMap, SchoolInfo, Schools, SCHOOL_MAP } from './basketball/models/Team';
import { environment } from './basketball/models/Environment';
import { all_emojis, EMOJI_MAP } from './basketball/models/Emojis';
import { TeamHandler } from './discord/message_handlers/basketball/TeamHandler';
import { TeamsHandler } from './discord/message_handlers/basketball/TeamsHandler';

config();
const env = process.env.ENV as environment;

// SETTING UP EMOJIS (in Emoji.ts)
const emoji_map = EMOJI_MAP;

// SETTING UP SCHOOLS (in Team.ts)
const schoolMap = SCHOOL_MAP;
export const SCHOOL_ID_MAP = getSchoolIdMap();

// SETTING UP CBB MANAGER
const cbbOptions: CBBManagerOptions = {
    team: schoolMap[Schools.colorado],
    teams: SCHOOL_ID_MAP,
    season: '2020',
    SPORTSRADAR_TOKEN: process.env.SPORTSRADAR_TOKEN,
    team_logos: Object.values(schoolMap).map((school: SchoolInfo) => ({
        team: school.bb_id,
        emoji: emoji_map[school.emoji],
    })),
    player_logos: [
        {team: schoolMap[Schools.colorado].bb_id, jersey_number: '21', emoji: emoji_map[all_emojis.evan]},
        {team: schoolMap[Schools.colorado].bb_id, jersey_number: '25', emoji: emoji_map[all_emojis.kin]}
    ]
}

export const cbbManager = new CBBManager(cbbOptions);

// SETTING UP BOT
export const botOptions: DiscordBotOptions = {
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID,
    commandPrefix: process.env.COMMAND_PREFIX,
    commandHandlers: []
};

export const DISCORD_CHANNEL_IDS = {
    basketball: process.env.DISCORD_CHANNEL_BASKETBALL,
    football: process.env.DISCORD_CHANNEL_FOOTBALL
};
// set commandHandlers after botOptions creation so the handlers can have access to the config
const handlers = [
    new PingHandler([]),
    new PlayersHandler([DISCORD_CHANNEL_IDS.basketball]),
    new GamesHandler([DISCORD_CHANNEL_IDS.basketball]),
    new BoxScoreHandler([DISCORD_CHANNEL_IDS.basketball]),
    new GameHandler([DISCORD_CHANNEL_IDS.basketball]),
    new ConfHandler([DISCORD_CHANNEL_IDS.basketball]),
    new HelpHandler([]),
    new TeamHandler([DISCORD_CHANNEL_IDS.basketball]),
    new TeamsHandler([DISCORD_CHANNEL_IDS.basketball]),
];
botOptions.commandHandlers = handlers;

const discordBot = new DiscordBot(botOptions);
