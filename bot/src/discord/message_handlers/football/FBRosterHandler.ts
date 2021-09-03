import * as discordjs from 'discord.js';
import { DISCORD_CHANNEL_IDS, FOOTBALL_MANAGER } from '../../..';
import { PlayersEntity } from '../../../apis/football/models';
import { COLLEGES } from '../../../colleges/info';
import { EmbedMessage, getDiscordJSEmbedObject } from '../../helpers/Embed';
import { UserCommand } from '../../helpers/UserCommand';
import { MessageHandler } from '../MessageHandler';

export class FBRosterHandler extends MessageHandler {
    command_string = 'roster';
    description = 'Displays the current roster.';
    channels = [...DISCORD_CHANNEL_IDS.football];
    hideInHelpMenu = false;

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        const players = (await FOOTBALL_MANAGER.getRoster()).players;
        if (userCommand.args.length === 0) {
            // display list of positions
            const messagePrefix = `Please specify which position you'd like to see. Here are the options:\n`;
            const positions = players.map((a: PlayersEntity) => a.position)
                .filter((position: string, index: number, ar: string[]) => ar.indexOf(position) === index)
                .sort();
            const messageSuffix = `\n Example command: \`${userCommand.prefix}${this.command_string} ${positions[0]}\``;
            const message = messagePrefix + positions.map(position => `**${position}**`).join(', ') + messageSuffix;
            
            return msg.channel.send(message);
        }
        const position = userCommand.args[0];

        
        const msg_resp = `**Colorado** Players in position **${position}**:\n` + players
            .filter((a: PlayersEntity) => a.position === position)
            .sort((a: PlayersEntity, b: PlayersEntity) => {
                return (parseInt(a.jersey) < parseInt(b.jersey) ) ? -1 : 1;
            })
            .map((player: PlayersEntity) => `**${player.jersey}:** ${player.name}, ${player.eligibility}, ${player.height}in ${player.weight}lbs`)
            .join("\n");
        msg.channel.send(msg_resp, { split: true });
    }
}