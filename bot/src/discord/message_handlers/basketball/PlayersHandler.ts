import * as discordjs from 'discord.js';
import { cbbManager, DISCORD_CHANNEL_IDS } from '../../..';
import BBPlayer from '../../../basketball/models/Player';
import { getAPIErrorMessage, ResponseStatus } from '../../../common/APIResponse';
import { EmbedMessage, getDiscordJSEmbedObject } from '../../helpers/Embed';
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
        const display_string = players
            .map((player: BBPlayer) => cbbManager.getPlayerAsTextRow(player))
            .join('\n');
        const embed_msg: EmbedMessage = {
            title: `Colorado Players`,
            timestamp: new Date(),
            description: display_string,
        };
        msg.channel.send(getDiscordJSEmbedObject(embed_msg));
    }
}