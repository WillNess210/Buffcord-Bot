import * as discordjs from 'discord.js';
import {cbbManager } from '../..';
import { EMOJI_MAP } from '../../basketball/models/Emojis';
import { SchoolInfo, Schools, SCHOOL_MAP } from '../../basketball/models/Team';
import { EmbedMessage, getDiscordJSEmbedObject } from '../helpers/Embed';
import { UserCommand } from '../helpers/UserCommand';
import { MessageHandler } from './MessageHandler';

export class TeamsHandler extends MessageHandler {
    command_string = 'teams';
    description = `Displays all teams with codes`;

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        const teams = Object.values(cbbManager.options.teams)
            .sort((a: SchoolInfo, b: SchoolInfo) => 
                a.name.toLocaleString().localeCompare(b.name.toLocaleString()));
        const embed_msg: EmbedMessage = {
            title: `Teams`,
            timestamp: new Date(),
            footer: {
                text: "Buffcord",
                icon_url: SCHOOL_MAP[Schools.colorado].logo_url
            },
            description: teams.map((school: SchoolInfo) => `${EMOJI_MAP[school.emoji]} ${school.name}: ${school.short}`).join('\n')
        };
        msg.channel.send(getDiscordJSEmbedObject(embed_msg));
    }
}