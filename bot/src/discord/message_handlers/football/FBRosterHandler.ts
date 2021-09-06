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
    description = `Displays the current roster. (use \`${botOptions.commandPrefix}teams\` to get a list of teams)`;
    usage = [{
        command: "roster [team]",
        description: `to view a teams positions`
    }, {
        command: "roster [team] [position]",
        description: "to view players"
    }];
    channels = [...DISCORD_CHANNEL_IDS.football];

    private playerToEmbed = (player: PlayersEntity): EmbedField => {
        const height = getHeightString(player.height);
        const status = footballPlayerStatusToDescription(player.status);
        const location = locationStripUSA(player.birth_place);
        return {
            title: `${player.jersey}. ${player.name}`,
            value: `${player.eligibility}\n${height} ${player.weight}lbs\n${status}\n${location}`,
            inline: true,
        }
    }

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        if (userCommand.args.length === 0) {
            return this.sendTextMessage(msg, this.messageHandlerToString(this, userCommand.prefix));
        }
        const team = getCollegeInformationFromShort(userCommand.args[0]);
        if (team === null) {
            return this.sendTextMessage(msg, `Error: \`${userCommand.args[0]}\` is not a valid team. Use \`${userCommand.prefix}teams\` for a list of teams.\nExample: \`${userCommand.prefix}${userCommand.command} ${DEFAULT_TEAM.short}\` for ${DEFAULT_TEAM.name}`);
        }
        const positions = await FOOTBALL_MANAGER.getPositionsForTeam(team);
        const positionIncludedInRequest = userCommand.args.length > 1;
        const position = positionIncludedInRequest ? userCommand.args[1].toUpperCase() : "";
        const positionValid = positionIncludedInRequest && positions.find((pos: string) => pos === position);
        if (!positionIncludedInRequest || !positionValid) {
            const invalidPositionLine = positionIncludedInRequest && !positionValid ? `\`${position}\` is not a valid position. ` : "";
            const optionsLine = invalidPositionLine + `Please specify which position you'd like to see. Here are the options:\n`;
            const exampleLine = `\n Example command: \`${userCommand.prefix}${this.commandString} ${team.short} ${positions[0]}\` to get all ${positions[0]} players for ${team.name}.`;
            const message = optionsLine + positions.map(position => `**${position}**`).join(', ') + exampleLine;
            return this.sendTextMessage(msg, message);
        }

        const msgFields = (await FOOTBALL_MANAGER.getRosterForTeam(team, position))
            .map(this.playerToEmbed);
        this.sendEmbedMessage(msg, {
            color: team.color,
            fields: msgFields,
            primaryTitle: `${team.name} ${await FOOTBALL_MANAGER.getTeamName(team)}`,
            primarTitleImageUrl: team.logo_url,
            secondaryTitle: `Players at ${footballPlayerPositionToDescription(position)}`,
        });
    }

}