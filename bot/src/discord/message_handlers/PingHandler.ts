import * as discordjs from 'discord.js';
import { EmbedMessage, getDiscordJSEmbedObject } from '../helpers/Embed';
import { UserCommand } from '../helpers/UserCommand';
import { MessageHandler } from './MessageHandler';

export class PingHandler extends MessageHandler {
    command_string = 'ping';
    description = 'Responds pong. Is used to test bot activity.';
    channels = [];
    hideInHelpMenu = true;

    testEmbed: EmbedMessage = {
        title: "test",
        description: "test2",
        url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ac/Pac-12_logo.svg/1200px-Pac-12_logo.svg.png",
        color: 7240986,
        timestamp: new Date(),
        footer: {
            text: "test4",
            icon_url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ac/Pac-12_logo.svg/1200px-Pac-12_logo.svg.png"
        },
        thumbnail: {
            url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ac/Pac-12_logo.svg/1200px-Pac-12_logo.svg.png",
        },
        author: {
            name: 'Will',
            url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ac/Pac-12_logo.svg/1200px-Pac-12_logo.svg.png",
            icon_url: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ac/Pac-12_logo.svg/1200px-Pac-12_logo.svg.png",
        },
        fields: [
            {title: 'a', value: 'b'},
            {title: 'c', value: 'd'},
            {title: 'e', value: 'f', inline: true},
            {title: 'g', value: 'h', inline: true},
            {title: 'i', value: 'k', inline: true},
            {title: 'e', value: 'f', inline: true},
            {title: 'g', value: 'h', inline: true},
            {title: 'i', value: 'k', inline: true},
            {title: 'e', value: 'f', inline: true},
            {title: 'g', value: 'h', inline: true},
            {title: 'i', value: 'k', inline: true},
        ]
    }

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        msg.channel.send('pong');
    }
}