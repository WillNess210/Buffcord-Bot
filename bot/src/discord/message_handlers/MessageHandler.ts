import * as discordjs from 'discord.js';
import { APIResponse } from '../../common/APIResponse';
import { UserCommand } from '../helpers/UserCommand';

// All message handlers should extend this
export class MessageHandler {
    command_string: string; // Set this in each class! Should be what you want user to call, ex: '!login' command_string should be 'login'
    description: string; // Set this in each class! Will be displayed in the help command
    usage?: string; // Set this in each class (optional)! Will be displayed after the string "Usage: [prefix][command_stirng]" (ex: "Usage: ~help ")
    channels: string[]; // Set this in each class. Leave blank if command applies to all channels
    hideInHelpMenu?: boolean;

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        console.log(`Undefined message handler ${this.command_string} received ${msg.content}`);
    }
}