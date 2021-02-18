import * as discordjs from 'discord.js';
import { MessageHandler } from './message_handlers/MessageHandler';
import { messageContentToUserCommand, UserCommand } from './UserCommand';

export interface DiscordBotOptions {
    commandPrefix: string;
    DISCORD_BOT_TOKEN: string;
    commandHandlers: MessageHandler[];
}

export class DiscordBot {
    private discordjsBot: discordjs.Client;
    private options: DiscordBotOptions;
    private commandHandlers: { [key: string]: MessageHandler; };
    
    constructor (options: DiscordBotOptions) {
        this.discordjsBot = new discordjs.Client();
        this.options = options;
        this.discordjsBot.login(this.options.DISCORD_BOT_TOKEN);
        this.setupDiscordJSBot();
    }

    private setupDiscordJSBot = () => {
        // send init message
        this.discordjsBot.on('ready', () => {
            console.info(`Bot logged in as ${this.discordjsBot.user.tag}!`);
        });
        // handle all messages
        this.addCommandHandlers();
        this.discordjsBot.on('message', (msg: discordjs.Message) => this.handleMessage(this.options.commandPrefix, msg));

    }

    private addCommandHandlers = () => {
        this.commandHandlers = {};
        this.options.commandHandlers.forEach((handler: MessageHandler) => {
            this.commandHandlers[handler.command_string] = handler;
        });
    }

    private commandNotFoundError = (command: UserCommand): string => `Command '${command.command}' not recognized.`;

    private handleMessage = (commandPrefix: string, msg: discordjs.Message) => {
        const msg_content = msg.content;
        // if message isn't a command or is only the command prefix, return
        if (msg_content.charAt(0) !== commandPrefix || msg_content.length === 1) return;
        
        const user_command = messageContentToUserCommand(commandPrefix, msg_content);
        if (!(user_command.command in this.commandHandlers)) {
            msg.reply(this.commandNotFoundError(user_command));
            return;
        }
        this.commandHandlers[user_command.command].handleMessage(msg, user_command);
    }
}