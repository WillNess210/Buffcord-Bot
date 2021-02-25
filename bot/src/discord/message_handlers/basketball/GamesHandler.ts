import * as discordjs from 'discord.js';
import { cbbManager, DISCORD_CHANNEL_IDS } from '../../..';
import { BBGame } from '../../../basketball/models/Game';
import { getAPIErrorMessage, ResponseStatus } from '../../../common/APIResponse';
import { ReadableDateShort } from '../../../common/DateHelper';
import { EmbedMessage, getDiscordJSEmbedObject } from '../../helpers/Embed';
import { UserCommand } from '../../helpers/UserCommand';
import { MessageHandler } from '../MessageHandler';

export class GamesHandler extends MessageHandler {
    command_string = 'games';
    description = 'Displays the current season\'s schedule.';
    channels = [DISCORD_CHANNEL_IDS.basketball];
    
    async handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        const resp = await cbbManager.getTeamSchedule();
        if (resp.status === ResponseStatus.FAILURE) {
            msg.reply(getAPIErrorMessage(resp));
            return;
        }
        const games: BBGame[] = resp.data;
        const display_string = games
            .map((game: BBGame) => `${ReadableDateShort(game.data.date)}: ${game.getGameTextHeader(cbbManager)}`)
            .join('\n');
        const embed_msg: EmbedMessage = {
            title: `Colorado Games`,
            timestamp: new Date(),
            description: display_string,
        };
        msg.channel.send(getDiscordJSEmbedObject(embed_msg), {split: true});
    }
}