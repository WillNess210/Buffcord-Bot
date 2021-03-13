import * as discordjs from 'discord.js';
import { MessageHandler } from './message_handlers/MessageHandler';
import { messageContentToUserCommand, UserCommand } from './helpers/UserCommand';
import { botOptions, DISCORD_CHANNEL_IDS } from '..';

export interface DiscordBotOptions {
    DISCORD_BOT_TOKEN: string;
    DISCORD_GUILD_ID: string[];
    commandPrefix: string;
    commandHandlers: MessageHandler[];
}

export interface DiscordEmoji {
    key: string;
    msg: string;
}

export class DiscordBot {
    private discordjsBot: discordjs.Client;
    private buffcord: discordjs.Guild;
    private options: DiscordBotOptions;
    private commandHandlers: { [key: string]: MessageHandler; };
    
    constructor (options: DiscordBotOptions) {
        this.discordjsBot = new discordjs.Client();
        this.options = options;
        this.discordjsBot.login(this.options.DISCORD_BOT_TOKEN);
        this.fetchBuffcord();
        this.setupDiscordJSBot();
    }

    private fetchBuffcord = async () => {
        //this.buffcord = await this.discordjsBot.guilds.fetch(this.options.DISCORD_GUILD_ID);
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

    private commandNotFoundError = (command: UserCommand): string => `Command '${command.command}' not recognized. Type ${botOptions.commandPrefix}help for a list of commands.`;

    private handleMessage = async (commandPrefix: string, msg: discordjs.Message) => {
        if(!this.options.DISCORD_GUILD_ID.includes(msg.guild.id)) return;
        const msg_content = msg.content;
        // if message isn't a command or is only the command prefix, return
        if (msg_content.charAt(0) !== commandPrefix || msg_content.length === 1) return;

        const user_command = messageContentToUserCommand(commandPrefix, msg_content);
        const command_handler = this.commandHandlers[user_command.command];
        const is_help_command = !!command_handler && user_command.command === 'help';
        
        if (!command_handler && [...DISCORD_CHANNEL_IDS.basketball, ...DISCORD_CHANNEL_IDS.football].includes(msg.channel.id)) {
            msg.reply(this.commandNotFoundError(user_command));
            return;
        }
        if (!command_handler) return;
        if(command_handler.channels.length > 0 && !command_handler.channels.includes(msg.channel.id)) return;
        msg.channel.startTyping();
        await this.commandHandlers[user_command.command].handleMessage(msg, user_command);
        console.log('stopping typing');
        msg.channel.stopTyping();
    }
}