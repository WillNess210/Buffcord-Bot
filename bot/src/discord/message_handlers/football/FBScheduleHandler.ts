import * as discordjs from 'discord.js';
import { botOptions, DEFAULT_TEAM, DISCORD_CHANNEL_IDS, FOOTBALL_MANAGER } from "../../..";
import { GameResponse, Team } from '../../../apis/football/models';
import { getCollegeInformationFromShort } from '../../../colleges/info';
import { UserCommand } from "../../helpers/UserCommand";
import { MessageHandler } from "../MessageHandler";

export class FBScheduleHandler extends MessageHandler {
    commandString = 'schedule';
    description = `Displays a teams schedule. (use \`${botOptions.commandPrefix}teams\` to get a list of teams)`;
    usage = [{
        command: "schedule [team]",
        description: `to view a teams schedule`
    }];
    channels = [...DISCORD_CHANNEL_IDS.football];

    private styleText = (text: string | number, bold: boolean) => bold ? `**${text}**` : text;
    private getTeamString = (team: Team, bold: boolean, won: boolean, score?: number) =>
        FOOTBALL_MANAGER.getEmojiForTeamId(team.id) + this.styleText(team.name, bold) + (score ? `(${this.styleText(score, won)})` : '');

    private gameToString = (game: GameResponse): string => {
        if (game.isByeWeek) return `${game.weekNumber}: **Bye Week**`;
        const awayTeam = this.getTeamString(game.game.away, !game.requestTeamIsHome, !game.homeWon, game.gameFinished ? game.game.scoring.away_points : undefined);
        const homeTeam = this.getTeamString(game.game.home, game.requestTeamIsHome, game.homeWon, game.gameFinished ? game.game.scoring.home_points : undefined);

        return `${game.weekNumber}: ${awayTeam} ${game.game.neutral_site ? 'vs' : this.styleText('@', game.requestTeamIsHome)} ${homeTeam}`;
    }

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        if (userCommand.args.length === 0) {
            return this.sendTextMessage(msg, this.messageHandlerToString(this, userCommand.prefix));
        }
        const team = getCollegeInformationFromShort(userCommand.args[0]);
        if (team === null) {
            return this.sendTextMessage(msg, `Error: \`${userCommand.args[0]}\` is not a valid team. Use \`${userCommand.prefix}teams\` for a list of teams.\nExample: \`${userCommand.prefix}${userCommand.command} ${DEFAULT_TEAM.short}\` for ${DEFAULT_TEAM.name}`);
        }
        const schedule = await FOOTBALL_MANAGER.getScheduleForTeam(team);
        const teamName = (schedule.games[0].requestTeamIsHome ? schedule.games[0].game.home : schedule.games[0].game.away).name;
        const msgResponse = schedule.games.map(this.gameToString).join('\n');
        if (msgResponse.length >= 6000) {
            return this.sendTextMessage(msg, msgResponse);
        }
        this.sendEmbedMessage(msg, {
            color: team.color,
            primaryTitle: `${teamName} (${schedule.wins}-${schedule.losses})`,
            primarTitleImageUrl: team.logo_url,
            secondaryTitle: `${await FOOTBALL_MANAGER.getYear()} Schedule (${schedule.gamesToPlay} games to play)`,
            content: msgResponse
        })
    }
}
