import * as discordjs from 'discord.js';
import { DEFAULT_TEAM, DISCORD_MANAGER } from '../..';
import { DiscordColor } from '../helpers/Color';
import { EmbedField, getDiscordJSEmbedObject } from '../helpers/Embed';
import { UserCommand } from '../helpers/UserCommand';

export interface MessageListenerEmbed {
    color?: DiscordColor;
    content?: string;
    primaryTitle?: string;
    primarTitleImageUrl?: string;
    secondaryTitle?: string;
    fields?: EmbedField[];
}

export class MessageListener {

    async handleMessage(msg: discordjs.Message, userCommand?: UserCommand): Promise<any> {}
    async shouldTrigger(msg: discordjs.Message): Promise<boolean>{ return false; };

    protected sendTextMessage = (msg: discordjs.Message, content: string, channelToSendId?: string): any => {
        if (channelToSendId) {
            DISCORD_MANAGER.sendMessageToChannel(channelToSendId, content);
        } else {
            msg.channel.send(content, {split: true});
        }
    }

    protected sendEmbedMessage = (msg: discordjs.Message, embed: MessageListenerEmbed, channelToSendId?: string): any => {
        if (channelToSendId) {
            DISCORD_MANAGER.sendMessageToChannel(channelToSendId, embed);
        } else {
            msg.channel.send(DISCORD_MANAGER.convertEmbedToObj(embed));
        }
    } 
}