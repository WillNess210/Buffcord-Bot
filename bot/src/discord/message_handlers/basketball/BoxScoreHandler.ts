import * as discordjs from 'discord.js';
import { cbbManager, DISCORD_CHANNEL_IDS } from '../../..';
import { BBGameBoxScore, BBTeamBoxScore } from '../../../basketball/models/GameBoxScore';
import BBPlayer, { BBPlayerMap, BBPlayersToMap } from '../../../basketball/models/Player';
import { BBTeam } from '../../../basketball/models/Team';
import { getAPIErrorMessage, ResponseStatus } from '../../../common/APIResponse';
import { BLANK_EMBED_FIELD, EmbedMessage, getDiscordJSEmbedObject } from '../../helpers/Embed';
import { UserCommand } from '../../helpers/UserCommand';
import { MessageHandler } from '../MessageHandler';

export const getTeamGameScoreEmbed = (team: BBTeam, team_score: BBTeamBoxScore, players: BBPlayerMap): EmbedMessage => {
    return {
        title: `${team.school} ${team.name} (${team.wins}-${team.losses})`,
        description: team_score.player_scores.length === 0 ? 'No player data' : team_score
            .player_scores
            .map(score => cbbManager.getBoxScoreAsTextRow(players[score.id], score)).join('\n'),
        color: team.schoolInfo && team.schoolInfo.color 
            ? team.schoolInfo.color.getInt()
            : 0,
        timestamp: new Date(),
        thumbnail: {
            url: team.schoolInfo.logo_url,
        },
        fields: [
            {title: 'Points', value: team_score.points + '', inline: true},
            {title: 'Personal Fouls', value: team_score.personal_fouls + '', inline: true},
            BLANK_EMBED_FIELD,
            {title: 'FG', value: `${team_score.field_goals_made}-${team_score.field_goals_att}`, inline: true},
            {title: 'FG%', value: team_score.field_goals_pct + '', inline: true},
            BLANK_EMBED_FIELD,
            {title: '3PT', value: `${team_score.three_points_made}-${team_score.three_points_att}`, inline: true},
            {title: '3PT%', value: team_score.three_points_pct + '', inline: true},
            BLANK_EMBED_FIELD,
            {title: 'FT', value: `${team_score.free_throws_made}-${team_score.free_throws_att}`, inline: true},
            {title: 'FT%', value: team_score.free_throws_pct + '', inline: true},
            BLANK_EMBED_FIELD,
        ]
    } 
};

export class BoxScoreHandler extends MessageHandler {
    command_string = 'box';
    description = 'Displays the box score for the current game.';
    channels = DISCORD_CHANNEL_IDS.basketball;

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
        const scores: BBGameBoxScore = respBS.data;
        const homeTeam: BBTeam = respTS.data[scores.homeTeam.id];
        const awayTeam: BBTeam = respTS.data[scores.awayTeam.id];

        const respHP = await cbbManager.getTeamPlayers(homeTeam.id);
        if(respHP.status === ResponseStatus.FAILURE){
            msg.reply(getAPIErrorMessage(respHP));
            return;
        }
        const respAP = await cbbManager.getTeamPlayers(awayTeam.id);
        if(respAP.status === ResponseStatus.FAILURE){
            msg.reply(getAPIErrorMessage(respAP));
            return;
        }
        const homePlayers: BBPlayerMap = BBPlayersToMap(respHP.data);
        const awayPlayers: BBPlayerMap = BBPlayersToMap(respAP.data);
        
        msg.channel.send(getDiscordJSEmbedObject(getTeamGameScoreEmbed(awayTeam, scores.awayTeam, awayPlayers)));
        msg.channel.send(getDiscordJSEmbedObject(getTeamGameScoreEmbed(homeTeam, scores.homeTeam, homePlayers)));
    }
}