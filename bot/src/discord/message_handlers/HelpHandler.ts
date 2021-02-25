import * as discordjs from 'discord.js';
import { botOptions, DISCORD_CHANNEL_IDS } from '../..';
import { UserCommand } from '../helpers/UserCommand';
import { MessageHandler } from './MessageHandler';

export class HelpHandler extends MessageHandler {
    command_string = 'help';
    description = 'Displays the help menu.';

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand): Promise<any> {
        const request_channel = Object.values(DISCORD_CHANNEL_IDS).find((id: string) => id === msg.channel.id);
        if (!request_channel) return msg.channel.send(`I do not work in this channel. Try this command in ${msg.guild.channels.cache.get(DISCORD_CHANNEL_IDS.football)} for football and ${msg.guild.channels.cache.get(DISCORD_CHANNEL_IDS.basketball)} for basketball.`);
        const display_string = '**Commands**:\n' + 
            botOptions.commandHandlers
                .filter((handler: MessageHandler) => handler.channels.includes(request_channel))
                .sort((a: MessageHandler, b: MessageHandler): number => a.command_string < b.command_string ? -1 : 1)
                .map((handler: MessageHandler) => messageHandlerToString(handler))
                .join('\n');
        msg.channel.send(display_string);
    }
}

const messageHandlerToString = (handler: MessageHandler): string =>
`**${handler.command_string}:** ${handler.description}`;