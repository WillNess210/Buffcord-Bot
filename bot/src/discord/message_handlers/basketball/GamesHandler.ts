import * as discordjs from 'discord.js';
import { cbbManager } from '../../..';
import { BBGame } from '../../../basketball/models/Game';
import { getAPIErrorMessage, ResponseStatus } from '../../../common/APIResponse';
import { UserCommand } from '../../helpers/UserCommand';
import { MessageHandler } from '../MessageHandler';

export class GamesHandler extends MessageHandler {
    command_string = 'games';
    description = 'Displays the current season\'s schedule.';

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        const resp = await cbbManager.getTeamSchedule();
        if (resp.status === ResponseStatus.FAILURE) {
            msg.reply(getAPIErrorMessage(resp));
            return;
        }
        const players: BBGame[] = resp.data;
        const display_string = 'Games:\n' + players
            .map((game: BBGame) => cbbManager.getGameAsTextRow(game))
            .join('\n');
        msg.channel.send(display_string, {split: true});
    }
}