import * as discordjs from 'discord.js';
import { DEFAULT_TEAM } from '../..';
import { DiscordColor } from '../helpers/Color';
import { EmbedField, getDiscordJSEmbedObject } from '../helpers/Embed';
import { UserCommand } from '../helpers/UserCommand';

export interface CommandUsage {
    command: string; // ex: "roster [team]"
    description: string; // ex: "displays positions on team"
}

export interface MessageHandlerEmbed {
    color?: DiscordColor;
    content?: string;
    primaryTitle?: string;
    primarTitleImageUrl?: string;
    secondaryTitle?: string;
    fields: EmbedField[];
}


// All message handlers should extend this
export class MessageHandler {
    commandString: string; // Set this in each class! Should be what you want user to call, ex: '!login' commandString should be 'login'
    description: string; // Set this in each class! Will be displayed in the help command
    usage?: CommandUsage[]; // Set this in each class (optional)! Will be displayed after the string "Usage: [prefix][command_string]" (ex: "Usage: ~help ")
    channels: string[]; // Set this in each class. Leave blank if command applies to all channels
    hideInHelpMenu?: boolean; // Set this for this message to never appear in a help menu

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand): Promise<any> {
        console.log(`Undefined message handler ${this.commandString} received ${msg.content}`);
    }

    protected messageHandlerToString = (handler: MessageHandler, prefix: string): string => {
        const desc = `**${handler.commandString}:** ${handler.description}`;
        if (!handler.usage) return desc;
        return desc + "\n" + handler.usage
            .map((usage: CommandUsage) => `\t usage: **${prefix}${usage.command}** (${usage.description})`)
            .join("\n");
    }

    protected sendTextMessage = (msg: discordjs.Message, content: string): any => {
        msg.channel.send(content, {split: true})
    }

    protected sendEmbedMessage = (msg: discordjs.Message, {
        color = new DiscordColor(0, 0, 0),
        content,
        primaryTitle,
        primarTitleImageUrl,
        secondaryTitle,
        fields,
    }: MessageHandlerEmbed): any => {
        const embedObj = getDiscordJSEmbedObject({
            description: content || "",
            color: color.getInt(),
            timestamp: new Date(),
            title: secondaryTitle,
            thumbnail: {
                url: primarTitleImageUrl
            },
            author: {
                name: primaryTitle,
            },
            footer: {
                text: "Buffcord",
                icon_url: DEFAULT_TEAM.logo_url
            },
            fields
        });
        msg.channel.send(embedObj);
    } 
}