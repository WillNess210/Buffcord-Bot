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

/*
TODO:
1. 'lineup' command shows the 5 on court players for each team w/ their stats
*/

config();

const environment = process.env as unknown as Environment;

// SETTING UP BOT
export const botOptions: DiscordBotOptions = {
    DISCORD_BOT_TOKEN: environment.DISCORD_BOT_TOKEN,
    DISCORD_GUILD_ID: environment.DISCORD_GUILD_ID.split(','),
    commandPrefix: environment.COMMAND_PREFIX,
    commandHandlers: []
};

export const DEFAULT_TEAM = getCollegeInformation(College.colorado);
export const FOOTBALL_MANAGER = new FBManager({token: environment.FB_SPORTSRADAR_TOKEN, season: ""});

export const DISCORD_CHANNEL_IDS = {
    basketball: process.env.DISCORD_CHANNEL_BASKETBALL.split(','),
    football: process.env.DISCORD_CHANNEL_FOOTBALL.split(',')
};
// set commandHandlers after botOptions creation so the handlers can have access to the config
const handlers = [
    new HelpHandler(),
    new PingHandler(),
    new FBRosterHandler(),
    new FBTeamsHandler(),
    new FBScheduleHandler()
];
botOptions.commandHandlers = handlers;

const discordBot = new DiscordBot(botOptions);
