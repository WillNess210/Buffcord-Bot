import * as discordjs from 'discord.js';
import { MessageHandler } from './message_handlers/MessageHandler';
import { messageContentToUserCommand, UserCommand } from './helpers/UserCommand';
import { botOptions, DISCORD_CHANNEL_IDS } from '..';

export interface DiscordBotOptions {
    DISCORD_BOT_TOKEN: string;
    DISCORD_GUILD_ID: string;
    commandPrefix: string;
    commandHandlers: MessageHandler[];
}

export class DiscordBot {
    public discordjsBot: discordjs.Client;
    public buffcord: discordjs.Guild;
    public options: DiscordBotOptions;
    private commandHandlers: { [key: string]: MessageHandler; };
    
    constructor (options: DiscordBotOptions) {
        this.discordjsBot = new discordjs.Client({});
        this.options = options;
        this.discordjsBot.login(this.options.DISCORD_BOT_TOKEN);
        this.fetchBuffcord();
        this.setupDiscordJSBot();
    }

    private fetchBuffcord = async () => {
        this.buffcord = await this.discordjsBot.guilds.fetch(this.options.DISCORD_GUILD_ID);
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
            this.commandHandlers[handler.commandString] = handler;
        });
    }

    private commandNotFoundError = (command: UserCommand): string => `Command '${command.command}' not recognized. Type ${botOptions.commandPrefix}help for a list of commands.`;

    private handleMessage = async (commandPrefix: string, msg: discordjs.Message) => {
        if(this.options.DISCORD_GUILD_ID !== (msg.guild.id)) return;
        if(msg.author.bot) return;
        const msgContent = msg.content;
        // if message isn't a command or is only the command prefix, return
        if (msgContent.charAt(0) !== commandPrefix || msgContent.length === 1) return;

        const userCommand = messageContentToUserCommand(commandPrefix, msgContent);
        const commandHandler = this.commandHandlers[userCommand.command];
        const isHelpCommand = !!commandHandler && userCommand.command === 'help';

        if (!commandHandler && [...DISCORD_CHANNEL_IDS.basketball, ...DISCORD_CHANNEL_IDS.football].includes(msg.channel.id)) {
            msg.reply(this.commandNotFoundError(userCommand));
            return;
        }
        if (!commandHandler) return;
        if(commandHandler.channels.length > 0 && !commandHandler.channels.includes(msg.channel.id)) return;
        try {
            await this.commandHandlers[userCommand.command].handleMessage(msg, userCommand);
        } catch (err: any) {
            msg.channel.send(`An API error occured. Please let Will know.\n${err}`);
            console.error(err);
        }
    }
}