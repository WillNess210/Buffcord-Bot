import * as discordjs from 'discord.js';
import { UserCommand } from '../helpers/UserCommand';
import { MessageListener } from './MessageListener';

export interface CommandUsage {
    command: string; // ex: "roster [team]"
    description: string; // ex: "displays positions on team"
}

// All message handlers should extend this
export class MessageHandler extends MessageListener {
    commandString: string; // Set this in each class! Should be what you want user to call, ex: '!login' commandString should be 'login'
    description: string; // Set this in each class! Will be displayed in the help command
    usage?: CommandUsage[]; // Set this in each class (optional)! Will be displayed after the string "Usage: [prefix][command_string]" (ex: "Usage: ~help ")
    channels: string[]; // Set this in each class. Leave blank if command applies to all channels
    hideInHelpMenu?: boolean; // Set this for this message to never appear in a help menu

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand): Promise<any> {
        console.log(`Undefined message handler ${this.commandString} received ${msg.content}`);
    }

    async shouldTrigger (msg: discordjs.Message): Promise<boolean> {
        return !this.channels || this.channels.length === 0 || msg.channel.id in this.channels;
    }

    protected messageHandlerToString = (handler: MessageHandler, prefix: string): string => {
        const desc = `**${handler.commandString}:** ${handler.description}`;
        if (!handler.usage) return desc;
        return desc + "\n" + handler.usage
            .map((usage: CommandUsage) => `\t usage: \`${prefix}${usage.command}\` (${usage.description})`)
            .join("\n");
    }
}