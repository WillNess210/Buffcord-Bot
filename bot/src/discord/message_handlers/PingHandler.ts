import * as discordjs from 'discord.js';
import { UserCommand } from '../UserCommand';
import { MessageHandler } from './MessageHandler';

export class PingHandler extends MessageHandler {
    command_string = 'ping';
    description = 'Responds pong. Is used to test bot activity.';

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        msg.channel.send('pong');
    }
}