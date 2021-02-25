import * as discordjs from 'discord.js';
import { cbbManager, DISCORD_CHANNEL_IDS } from '../../..';
import { BBGame } from '../../../basketball/models/Game';
import { BBGameBoxScore, BBTeamBoxScore } from '../../../basketball/models/GameBoxScore';
import { BBTeam } from '../../../basketball/models/Team';
import { getAPIErrorMessage, ResponseStatus } from '../../../common/APIResponse';
import { BLANK_EMBED_FIELD, EmbedMessage, getDiscordJSEmbedObject } from '../../helpers/Embed';
import { UserCommand } from '../../helpers/UserCommand';
import { MessageHandler } from '../MessageHandler';

const getGameEmbed = (game: BBGame, homeTeam: BBTeam, homeScore: BBTeamBoxScore, awayTeam: BBTeam, awayScore: BBTeamBoxScore): EmbedMessage => {
    const winningTeamID = game.noPointsScored() ? homeTeam.id : game.getWinningTeamID();
    const winningTeam = winningTeamID
        ? winningTeamID === awayTeam.id ? awayTeam : homeTeam
        : null;
    return {
        title: game.getGameTextHeader(cbbManager),
        description: game.getDateString(),
        color: winningTeam && winningTeam.schoolInfo ? winningTeam.schoolInfo.color.getInt() : undefined,
        timestamp: new Date(),
        thumbnail: {
            url: winningTeam && winningTeam.schoolInfo ? winningTeam.schoolInfo.logo_url : undefined,
        },
        fields: [
            {title: game.isAtNeutralSite() ? 'Team' : 'Away Team', value: awayTeam.school, inline: true},
            {title: game.isAtNeutralSite() ? 'Team' : 'Home Team', value: homeTeam.school, inline: true},
            BLANK_EMBED_FIELD,
            {title: 'Points', value: awayScore.points + '', inline: true},
            {title: 'Points', value: homeScore.points + '', inline: true},
            BLANK_EMBED_FIELD,
            {title: 'PF', value: awayScore.personal_fouls + '', inline: true},
            {title: 'PF', value: homeScore.personal_fouls + '', inline: true},
            BLANK_EMBED_FIELD,
            {title: 'FG', value: `${awayScore.field_goals_made}-${awayScore.field_goals_att} (${awayScore.field_goals_pct}%)`, inline: true},
            {title: 'FG', value: `${homeScore.field_goals_made}-${homeScore.field_goals_att} (${homeScore.field_goals_pct}%)`, inline: true},
            BLANK_EMBED_FIELD,
            {title: '3PT', value: `${awayScore.three_points_made}-${awayScore.three_points_att} (${awayScore.three_points_pct}%)`, inline: true},
            {title: '3PT', value: `${homeScore.three_points_made}-${homeScore.three_points_att} (${homeScore.three_points_pct}%)`, inline: true},
            BLANK_EMBED_FIELD,
            {title: 'FT', value: `${awayScore.free_throws_made}-${awayScore.free_throws_att} (${awayScore.free_throws_pct}%)`, inline: true},
            {title: 'FT', value: `${homeScore.free_throws_made}-${homeScore.free_throws_att} (${homeScore.free_throws_pct}%)`, inline: true},
            BLANK_EMBED_FIELD,
        ]
    }
}

export class GameHandler extends MessageHandler {
    command_string = 'game';
    description = 'Displays stats for the current game.';
    channels = [DISCORD_CHANNEL_IDS.basketball];

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        const respBS = await cbbManager.getGameBoxScore();
        if (respBS.status === ResponseStatus.FAILURE) {
            msg.reply(getAPIErrorMessage(respBS));
            return;
        }
        const respTS = await cbbManager.getAllTeams();
        if(respTS.status === ResponseStatus.FAILURE){
            msg.reply(getAPIErrorMessage(respTS));
            return;
        }
        const game: BBGame = cbbManager.currentGame;
        const scores: BBGameBoxScore = respBS.data;
        const homeTeam: BBTeam = respTS.data[scores.homeTeam.id];
        const awayTeam: BBTeam = respTS.data[scores.awayTeam.id];        

        msg.channel.send(getDiscordJSEmbedObject(getGameEmbed(game, homeTeam, scores.homeTeam, awayTeam, scores.awayTeam)));
    }
}