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
import { BBSchoolInfo, BBSchools, BB_SCHOOL_MAP } from './basketball/models/Team';
import { environment } from './basketball/models/Environment';
import { all_emojis, EMOJI_MAP } from './basketball/models/Emojis';

config();
const env = process.env.ENV as environment;

// SETTING UP EMOJIS (in Emoji.ts)
const emoji_map = EMOJI_MAP;

// SETTING UP SCHOOLS (in Team.ts)
const bbSchoolMap = BB_SCHOOL_MAP;

// SETTING UP CBB MANAGER
const cbbOptions: CBBManagerOptions = {
    team: bbSchoolMap[BBSchools.colorado],
    teams: bbSchoolMap,
    season: '2020',
    SPORTSRADAR_TOKEN: process.env.SPORTSRADAR_TOKEN,
    team_logos: Object.values(bbSchoolMap).map((school: BBSchoolInfo) => ({
        team: school.id,
        emoji: emoji_map[school.emoji],
    })),
    player_logos: [
        {team: bbSchoolMap[BBSchools.colorado].id, jersey_number: '21', emoji: emoji_map[all_emojis.evan]},
        {team: bbSchoolMap[BBSchools.colorado].id, jersey_number: '25', emoji: emoji_map[all_emojis.kin]}
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
