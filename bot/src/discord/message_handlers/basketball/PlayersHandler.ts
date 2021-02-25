import * as discordjs from 'discord.js';
import { cbbManager, DISCORD_CHANNEL_IDS } from '../../..';
import BBPlayer from '../../../basketball/models/Player';
import { getAPIErrorMessage, ResponseStatus } from '../../../common/APIResponse';
import { UserCommand } from '../../helpers/UserCommand';
import { MessageHandler } from '../MessageHandler';

export class PlayersHandler extends MessageHandler {
    command_string = 'players';
    description = 'Displays all current players on roster.';
    channels = [DISCORD_CHANNEL_IDS.basketball];

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        const resp = await cbbManager.getTeamPlayers();
        if (resp.status === ResponseStatus.FAILURE) {
            msg.reply(getAPIErrorMessage(resp));
            return;
        }
        const players: BBPlayer[] = resp.data;
        const display_string = 'Players:\n' + players
            .map((player: BBPlayer) => cbbManager.getPlayerAsTextRow(player))
            .join('\n');
        msg.channel.send(display_string);
    }
}