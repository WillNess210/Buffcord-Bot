import * as discordjs from 'discord.js';
import { UserCommand } from '../UserCommand';

// All message handlers should extend this
export class MessageHandler {
    command_string: string; // Set this in each class! Should be what you want user to call, ex: '!login' command_string should be 'login'

    handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        console.log(`Undefined message handler ${this.command_string} received ${msg.content}`);
    }
}