import * as discordjs from 'discord.js';
import { cbbManager } from '../..';
import { BBGame } from '../../basketball/models/Game';
import { BBGameBoxScore, BBPlayerBoxScore, BBPlayerBoxScoreMap, getBoxScorePlayerMap } from '../../basketball/models/GameBoxScore';
import BBPlayer, { BBPlayerMap, BBPlayersToMap } from '../../basketball/models/Player';
import { PlayerBoxScoreMap } from '../../basketball/models/PlayerBoxScore';
import { BBTeam } from '../../basketball/models/Team';
import { getAPIErrorMessage, ResponseStatus } from '../../common/APIResponse';
import { UserCommand } from '../UserCommand';
import { MessageHandler } from './MessageHandler';

export class BoxScoreHandler extends MessageHandler {
    command_string = 'box';
    description = 'Displays the box score for the current game.';

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
        
        const display_string = 
            `${cbbManager.getBoxScoreTeamHeader(homeTeam, scores.homeTeam)}
${scores.homeTeam.player_scores.map(score => cbbManager.getBoxScoreAsTextRow(homePlayers[score.id], score)).join('\n')}
${cbbManager.getBoxScoreTeamHeader(awayTeam, scores.awayTeam)}
${scores.awayTeam.player_scores.map(score => cbbManager.getBoxScoreAsTextRow(awayPlayers[score.id], score)).join('\n')}`;
        msg.channel.send(display_string, {split:true});
    }
}