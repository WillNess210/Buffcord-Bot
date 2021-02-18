import { config } from 'dotenv';
import { DiscordBot, DiscordBotOptions } from './discord/DiscordBot';
import { PingHandler } from './discord/message_handlers/PingHandler';

config();

const DISCORD_BOT_TOKEN: string = process.env.DISCORD_BOT_TOKEN;
const SPORTS_API_TOKEN:string = process.env.SPORTS_API_TOKEN;
const COMMAND_PREFIX:string = process.env.COMMAND_PREFIX

const botOptions: DiscordBotOptions = {
    DISCORD_BOT_TOKEN: DISCORD_BOT_TOKEN,
    commandPrefix: COMMAND_PREFIX,
    commandHandlers: [
        new PingHandler()
    ]
}

const discordBot = new DiscordBot(botOptions);
