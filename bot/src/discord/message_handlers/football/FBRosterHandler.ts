import * as discordjs from 'discord.js';
import { botOptions, DEFAULT_TEAM, DISCORD_CHANNEL_IDS, FOOTBALL_MANAGER } from '../../..';
import { PlayersEntity } from '../../../apis/football/models';
import { getCollegeInformation, getCollegeInformationFromShort } from '../../../colleges/info';
import { CollegeInformation } from '../../../colleges/model';
import { footballPlayerPositionToDescription, footballPlayerStatusToDescription, getHeightString, locationStripUSA } from '../../../common/utils';
import { EmbedField } from '../../helpers/Embed';
import { UserCommand } from '../../helpers/UserCommand';
import { MessageHandler } from '../MessageHandler';

interface RosterRequest {
    team: CollegeInformation;
    position: string;
}

export class FBRosterHandler extends MessageHandler {
    commandString = 'roster';
    description = 'Displays the current roster. (use \`${botOptions.commandPrefix}teams\` to get a list of teams)';
    usage = [{
        command: "roster [team]",
        description: `to view a teams positions`
    }, {
        command: "roster [team] [position]",
        description: "to view players"
    }];
    channels = [...DISCORD_CHANNEL_IDS.football];

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        if (userCommand.args.length === 0) {
            return this.sendTextMessage(msg, this.messageHandlerToString(this, userCommand.prefix));
        }
        const team = getCollegeInformationFromShort(userCommand.args[0]);
        if (team === null) {
            return this.sendTextMessage(msg, `Error: \`${userCommand.args[0]}\` is not a valid team. Use \`${userCommand.prefix}teams\` for a list of teams.\nExample: \`${userCommand.prefix}${userCommand.command} ${DEFAULT_TEAM.short}\` for ${DEFAULT_TEAM.name}`);
        }
        const rosterResponse = (await FOOTBALL_MANAGER.getRoster(team));
        const players = rosterResponse.players;
        const positions = players
                .map((a: PlayersEntity) => a.position.toUpperCase())
                .filter((position: string, index: number, ar: string[]) => ar.indexOf(position) === index)
                .sort();
        const positionIncludedInRequest = userCommand.args.length > 1;
        const position = positionIncludedInRequest ? userCommand.args[1].toUpperCase() : "";
        const positionValid = positionIncludedInRequest && positions.find((pos: string) => pos === position);
        if (!positionIncludedInRequest || !positionValid) {
            const invalidPositionLine = positionIncludedInRequest && !positionValid ? `${position} is not a valid position. ` : "";
            const optionsLine = invalidPositionLine + `Please specify which position you'd like to see. Here are the options:\n`;
            const exampleLine = `\n Example command: \`${userCommand.prefix}${this.commandString} ${team.short} ${positions[0]}\` to get all ${positions[0]} players for ${team.name}.`;
            const message = optionsLine + positions.map(position => `**${position}**`).join(', ') + exampleLine;
            return this.sendTextMessage(msg, message);
        }

        const msgFields = players
            .filter((a: PlayersEntity) => a.position === position)
            .sort((a, b) => parseInt(a.jersey) > parseInt(b.jersey) ? 1 : -1)
            .map((player: PlayersEntity) => ({
                title: `${player.jersey}. ${player.name}`,
                value: `${player.eligibility}\n${getHeightString(player.height)} ${player.weight}lbs\n${footballPlayerStatusToDescription(player.status)}\n${locationStripUSA(player.birth_place)}`,
                inline: true,
            } as EmbedField));
        this.sendEmbedMessage(msg, {
            color: team.color,
            fields: msgFields,
            primaryTitle: `${team.name} ${rosterResponse.name}`,
            primarTitleImageUrl: team.logo_url,
            secondaryTitle: `Players at ${footballPlayerPositionToDescription(position)}`,
        });
    }

}