import * as discordjs from 'discord.js';
import { cbbManager, DISCORD_CHANNEL_IDS } from '../../..';
import { BBTeam, SCHOOL_MAP } from '../../../basketball/models/Team';
import { getAPIErrorMessage, ResponseStatus } from '../../../common/APIResponse';
import { EmbedMessage, getDiscordJSEmbedObject } from '../../helpers/Embed';
import { UserCommand } from '../../helpers/UserCommand';
import { MessageHandler } from '../MessageHandler';

export class ConfsHandler extends MessageHandler {
    command_string = 'confs';
    description = 'Displays all conference codes.'
    channels = [DISCORD_CHANNEL_IDS.basketball];

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        const resp = await cbbManager.getAllTeams();
        if (resp.status === ResponseStatus.FAILURE) {
            msg.reply(getAPIErrorMessage(resp));
            return;
        }
        const conf_obj = {};
        Object.values(resp.data).forEach(team => conf_obj[team.conference] = team.conference);
        const conferences = Object.keys(conf_obj).sort();
        const embed_msg: EmbedMessage = {
            title: `Conferences`,
            timestamp: new Date(),
            description: conferences.join('\n'),
        };
        msg.channel.send(getDiscordJSEmbedObject(embed_msg));
    }
}