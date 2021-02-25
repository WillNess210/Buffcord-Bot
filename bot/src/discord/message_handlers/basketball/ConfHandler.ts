import * as discordjs from 'discord.js';
import { cbbManager, DISCORD_CHANNEL_IDS } from '../../..';
import { BBTeam } from '../../../basketball/models/Team';
import { getAPIErrorMessage, ResponseStatus } from '../../../common/APIResponse';
import { UserCommand } from '../../helpers/UserCommand';
import { MessageHandler } from '../MessageHandler';

export class ConfHandler extends MessageHandler {
    private defaultConference = 'PAC12';
    command_string = 'conf';
    description = 'Displays conference standings.'
    usage = `[conference_code]  (if conference_code is left blank, ${this.defaultConference} is default)`;
    channels = [DISCORD_CHANNEL_IDS.basketball];

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        const conference = userCommand.args.length === 0
            ? this.defaultConference
            : userCommand.args[0].toUpperCase();
        const resp = await cbbManager.getAllTeams();
        const myTeamResp = await cbbManager.getPrimaryTeam();
        if (resp.status === ResponseStatus.FAILURE || myTeamResp.status === ResponseStatus.FAILURE) {
            msg.reply(getAPIErrorMessage(resp));
            return;
        }
        const myTeam: BBTeam = myTeamResp.data as BBTeam;
        const teams: BBTeam[] = Object.values(resp.data)
        .filter((team: BBTeam) => team.conference === conference)
        .sort((a: BBTeam, b: BBTeam) => a.wins > b.wins ? -1 : 1);
        if (teams.length === 0) {
            msg.reply(`${conference} not found`);
            return;
        }
        const display_string = `**${conference}** Conference:\n` + teams
            .map((team: BBTeam, index: number) => `${team.id === myTeam.id ? `**${index + 1}` : index + 1}. ${cbbManager.getTeamAsTextRow(team)}${team.id === myTeam.id ? '**' : ''}`)
            .join('\n');
        msg.channel.send(display_string, {split: true});
    }
}