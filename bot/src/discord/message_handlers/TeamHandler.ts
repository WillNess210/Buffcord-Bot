import * as discordjs from 'discord.js';
import { botOptions, cbbManager } from '../..';
import { BBTeamMap, Schools, SCHOOL_MAP } from '../../basketball/models/Team';
import { getAPIErrorMessage, ResponseStatus } from '../../common/APIResponse';
import { EmbedMessage, getDiscordJSEmbedObject } from '../helpers/Embed';
import { UserCommand } from '../helpers/UserCommand';
import { MessageHandler } from './MessageHandler';

export class TeamHandler extends MessageHandler {
    command_string = 'team';
    description = `Displays information about a team.
        usage: ${botOptions.commandPrefix}${this.command_string} [team code] (use !teams for list of team codes)`;

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        const resp = await cbbManager.getAllTeams();
        if (resp.status === ResponseStatus.FAILURE) {
            msg.reply(getAPIErrorMessage(resp));
            return;
        }
        const team_resp = await cbbManager.getPrimaryTeam();
        if (team_resp.status === ResponseStatus.FAILURE) {
            msg.reply(getAPIErrorMessage(team_resp));
            return;
        }

        const teams: BBTeamMap = resp.data;
        const default_team = team_resp.data;
        const search_short = userCommand.args.length > 0 ? userCommand.args[0].toUpperCase() : default_team.schoolInfo.short;
        const team = Object.values(teams).find(tm => tm.schoolInfo && tm.schoolInfo.short === search_short);
        if ( !team ) {
            msg.reply(`Could not find team with code ${search_short}`);
            return;
        }
        
        const embed_msg: EmbedMessage = {
            title: `${team.school} ${team.name}`,
            description: team.conference,
            color: team.schoolInfo.color.getInt(),
            timestamp: new Date(),
            footer: {
                text: "Buffcord",
                icon_url: SCHOOL_MAP[Schools.colorado].logo_url
            },
            thumbnail: {
                url: team.schoolInfo.logo_url,
            },
            fields: [
                {title: 'Wins', value: team.wins + '', inline: true},
                {title: 'Losses', value: team.losses + '', inline: true},
            ]
        }
        msg.channel.send(getDiscordJSEmbedObject(embed_msg));
    }
}