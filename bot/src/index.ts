import { config } from 'dotenv';
import { DiscordBot, DiscordBotOptions } from './discord/DiscordBot';
import { PingHandler } from './discord/message_handlers/common/PingHandler';
import { HelpHandler } from './discord/message_handlers/common/HelpHandler';
import Environment from './common/Environment';
import FBSportsRadarApi from './apis/football/SportsRadarAPI';
import { FBRosterHandler } from './discord/message_handlers/football/FBRosterHandler';
import FBManager from './managers/FBManager';
import { College } from './colleges/model';
import { getCollegeInformation } from './colleges/info';
import { FBTeamsHandler } from './discord/message_handlers/football/FBTeamsHandler';
import { FBScheduleHandler } from './discord/message_handlers/football/FBScheduleHandler';
import { LastMessagedHandler } from './discord/message_handlers/admin/LastMessagedHandler';
import DiscordManager from './managers/DiscordManager';

/*
TODO:
1. 'lineup' command shows the 5 on court players for each team w/ their stats
*/

config();

const environment = process.env as unknown as Environment;

// SETTING UP BOT
export const botOptions: DiscordBotOptions = {
    DISCORD_BOT_TOKEN: environment.DISCORD_BOT_TOKEN,
    DISCORD_GUILD_ID: environment.DISCORD_GUILD_ID,
    commandPrefix: environment.COMMAND_PREFIX,
    commandHandlers: []
};

export const DEFAULT_TEAM = getCollegeInformation(College.colorado);
export const FOOTBALL_MANAGER = new FBManager({token: environment.FB_SPORTSRADAR_TOKEN, season: ""});

export const DISCORD_CHANNEL_IDS = {
    basketball: environment.DISCORD_CHANNEL_BASKETBALL.split(','),
    football: environment.DISCORD_CHANNEL_FOOTBALL.split(','),
    admin: environment.DISCORD_CHANNEL_ADMIN.split(','),
};
// set commandHandlers after botOptions creation so the handlers can have access to the config
const handlers = [
    // common
    new HelpHandler(),
    new PingHandler(),
    // football
    new FBRosterHandler(),
    new FBTeamsHandler(),
    new FBScheduleHandler(),
    // basketball
    // admin
    new LastMessagedHandler(),
];
botOptions.commandHandlers = handlers;

const discordBot = new DiscordBot(botOptions);
export const DISCORD_MANAGER = new DiscordManager(discordBot);