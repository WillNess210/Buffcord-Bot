import * as discordjs from 'discord.js';
import { APIResponse } from '../../common/APIResponse';
import { UserCommand } from '../helpers/UserCommand';

// All message handlers should extend this
export class MessageHandler {
    command_string: string; // Set this in each class! Should be what you want user to call, ex: '!login' command_string should be 'login'
    description: string; // Set this in each class! Will be displayed in the help command
    channels: string[];

    constructor(channel_ids?: string[]) {
        this.channels = channel_ids || [];
    }

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        console.log(`Undefined message handler ${this.command_string} received ${msg.content}`);
    }
}