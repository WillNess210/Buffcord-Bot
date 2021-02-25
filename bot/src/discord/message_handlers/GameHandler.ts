import * as discordjs from 'discord.js';
import { cbbManager } from '../..';
import { BBGameBoxScore } from '../../basketball/models/GameBoxScore';
import { BBTeam } from '../../basketball/models/Team';
import { getAPIErrorMessage, ResponseStatus } from '../../common/APIResponse';
import { UserCommand } from '../helpers/UserCommand';
import { MessageHandler } from './MessageHandler';

export class GameHandler extends MessageHandler {
    command_string = 'game';
    description = 'Displays stats for the current game.';

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
        const display_string = 
            `${cbbManager.getBoxScoreTeamHeader(homeTeam, scores.homeTeam)}
${cbbManager.getBoxScoreTeamHeader(awayTeam, scores.awayTeam)}
${cbbManager.currentGame.finished ? 'Final' : 'In Progress'}`;
        msg.channel.send(display_string, {split:true});
    }
}