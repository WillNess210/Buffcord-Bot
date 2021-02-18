import * as discordjs from 'discord.js';
import { UserCommand } from '../UserCommand';
import { MessageHandler } from './MessageHandler';

export class PingHandler extends MessageHandler {
    command_string = 'ping';

    handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        msg.channel.send('pong');
    }
}