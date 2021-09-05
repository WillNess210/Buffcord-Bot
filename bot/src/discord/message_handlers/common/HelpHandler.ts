import * as discordjs from 'discord.js';
import { botOptions, DISCORD_CHANNEL_IDS } from '../../..';
import { UserCommand } from '../../helpers/UserCommand';
import { CommandUsage, MessageHandler } from '../MessageHandler';

export class HelpHandler extends MessageHandler {
    commandString = 'help';
    description = 'Displays the help menu.';
    channels = [];

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand): Promise<any> {
        const requestChannel = [...DISCORD_CHANNEL_IDS.basketball, ...DISCORD_CHANNEL_IDS.football].find((id: string) => id === msg.channel.id);
        if (!requestChannel) return msg.channel.send(`I do not work in this channel.`);
        const displayString = '**Commands**:\n' +
            botOptions.commandHandlers
                .filter((handler: MessageHandler) => !handler.hideInHelpMenu && (handler.channels.length === 0 || handler.channels.includes(requestChannel)))
                .sort((a: MessageHandler, b: MessageHandler): number => a.commandString < b.commandString ? -1 : 1)
                .map((handler: MessageHandler) => this.messageHandlerToString(handler, userCommand.prefix))
                .join('\n');
        msg.channel.send(displayString);
    }
}