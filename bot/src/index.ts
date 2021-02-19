import { config } from 'dotenv';
import CBBManager, { CBBManagerOptions } from './basketball/CBBManager';
import { DiscordBot, DiscordBotOptions } from './discord/DiscordBot';
import { BoxScoreHandler } from './discord/message_handlers/BoxScoreHandler';
import { GameHandler } from './discord/message_handlers/GameHandler';
import { GamesHandler } from './discord/message_handlers/GamesHandler';
import { ConfHandler } from './discord/message_handlers/ConfHandler';
import { PingHandler } from './discord/message_handlers/PingHandler';
import { PlayersHandler } from './discord/message_handlers/PlayersHandler';
import { HelpHandler } from './discord/message_handlers/HelpHandler';
import { SchoolInfo, Schools, SCHOOL_MAP } from './basketball/models/Team';
import { environment } from './basketball/models/Environment';
import { all_emojis, EMOJI_MAP } from './basketball/models/Emojis';

config();
const env = process.env.ENV as environment;

// SETTING UP EMOJIS (in Emoji.ts)
const emoji_map = EMOJI_MAP;

// SETTING UP SCHOOLS (in Team.ts)
const schoolMap = SCHOOL_MAP;

// SETTING UP CBB MANAGER
const cbbOptions: CBBManagerOptions = {
    team: schoolMap[Schools.colorado],
    teams: schoolMap,
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
    DISCORD_CHANNELS: process.env.DISCORD_CHANNELS.split(','),
    commandPrefix: process.env.COMMAND_PREFIX,
    commandHandlers: []
};
// set commandHandlers after botOptions creation so the handlers can have access to the config
const handlers = [
    new PingHandler(),
    new PlayersHandler(),
    new GamesHandler(),
    new BoxScoreHandler(),
    new GameHandler(),
    new ConfHandler(),
    new HelpHandler()
];
botOptions.commandHandlers = handlers;

const discordBot = new DiscordBot(botOptions);
