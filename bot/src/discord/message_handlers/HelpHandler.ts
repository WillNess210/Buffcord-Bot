import * as discordjs from 'discord.js';
import { botOptions, cbbManager } from '../..';
import BBPlayer from '../../basketball/models/Player';
import { getAPIErrorMessage, ResponseStatus } from '../../common/APIResponse';
import { UserCommand } from '../UserCommand';
import { MessageHandler } from './MessageHandler';

export class HelpHandler extends MessageHandler {
    command_string = 'help';
    description = 'Displays the help menu.';

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        const display_string = '**Commands**:\n' + 
            botOptions.commandHandlers
                .sort((a: MessageHandler, b: MessageHandler): number => a.command_string < b.command_string ? -1 : 1)
                .map((handler: MessageHandler) => messageHandlerToString(handler))
                .join('\n');
        msg.channel.send(display_string);
    }
}

const messageHandlerToString = (handler: MessageHandler): string =>
`**${handler.command_string}:** ${handler.description}`;