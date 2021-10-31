import * as discordjs from 'discord.js';
import { DEFAULT_TEAM, LOCAL_DATABASE, NBA_MANAGER } from '../../..';
import { NBAGame, NBAGameSummaryPlayerStatistics } from '../../../apis/nba/models';
import { dateStringToReadableString } from '../../../common/utils';
import { MessageListenerEmbed } from '../MessageListener';
import { MessageTrigger } from '../MessageTrigger';
import { EmbedField } from '../../helpers/Embed';

interface GameIdsStorageObj {
    ids: string[];
}
interface GamePlayerPair {
    gameId: string;
    playerId: string;
    isOnHomeTeam: boolean;
}

const safeValue = (value: string | number | undefined): string => {
    return value ? `${value}` : "0";
}

export class NBATrackerTrigger extends MessageTrigger {
    name = "NBATracker";
    key: string;
    channelId: string;

    constructor(channelId: string) {
        super();
        const dateShouldTrigger = new Date(); // 8 AM
        dateShouldTrigger.setHours(7);
        dateShouldTrigger.setMinutes(0),
        dateShouldTrigger.setSeconds(0, 0);

        this.setDailyDateShouldTrigger(dateShouldTrigger);
        //this.setShouldTriggerEverytime();
        this.key = this.name + "games-covered";
        this.channelId = channelId;
    }

    async getNBAGameIdsCovered(): Promise<string[]> {
        const storage = await LOCAL_DATABASE.fetchItem<GameIdsStorageObj>(this.key);
        return storage === undefined ? [] : storage.ids;
    }

    async setNBAGameIdsCovered(ids: string[]) {
        await LOCAL_DATABASE.setItem(this.key, {ids});
    }

    getEmbedFieldsForPlayerInGame(stats: NBAGameSummaryPlayerStatistics): EmbedField[] {
        return [
            {title: "Points", value: safeValue(stats.points), inline: true},
            {title: "FT", value: `${safeValue(stats.free_throws_made)}/${safeValue(stats.free_throws_att)}`, inline: true},
            {title: "3P", value: `${safeValue(stats.three_points_made)}/${safeValue(stats.three_points_att)}`, inline: true},
            {title: "FG", value: `${safeValue(stats.field_goals_made)}/${safeValue(stats.field_goals_att)}`, inline: true},
            {title: "Assists", value: safeValue(stats.assists), inline: true},
            {title: "Rebounds", value: safeValue(stats.rebounds), inline: true},
            {title: "Blocks", value: safeValue(stats.blocks), inline: true},
            {title: "Steals", value: safeValue(stats.steals), inline: true},
            {title: "Turnovers", value: safeValue(stats.turnovers), inline: true},
        ];
    }

    async getEmbedForPlayerInGame(info: GamePlayerPair): Promise<MessageListenerEmbed> {
        const gameSummary = await NBA_MANAGER.getNBAGameSummary(info.gameId);
        const gameTitle = `${dateStringToReadableString(gameSummary.scheduled)}: ${gameSummary.away.name}(${gameSummary.away.points}) @ ${gameSummary.home.name}(${gameSummary.home.points})`;
        const playerSummary = await NBA_MANAGER.getPlayerSummaryInGame(info.gameId, info.playerId, info.isOnHomeTeam);
        if (playerSummary === undefined || !playerSummary.played) {
            return {
                primaryTitle: `Buff Tracker: ${playerSummary.full_name || ""}`,
                secondaryTitle: gameTitle,
                content: "DNP"
            }
        }
        return {
            primaryTitle: `Buff Tracker: ${playerSummary.full_name}`,
            secondaryTitle: gameTitle,
            fields: this.getEmbedFieldsForPlayerInGame(playerSummary.statistics)
        }
    }

    async onTrigger(msg: discordjs.Message) {
        const allGames = await (await NBA_MANAGER.getNBASchedule()).games;
        const trackedPlayers = await NBA_MANAGER.getAllPlayersFromCollege(DEFAULT_TEAM.name);
        const coveredIds = await this.getNBAGameIdsCovered();
        const gamesToCheck: GamePlayerPair[] = [];
        allGames.forEach((game) => {
            //|| game.id === 'c9f89c4c-db96-421c-a37e-0938d36141e1'
            if ((!(coveredIds.find(id => id === game.id)) && game.status === 'closed')) {
                coveredIds.push(game.id);
                trackedPlayers.forEach((player) => {
                    if (player.team_id === game.home.id) {
                        gamesToCheck.push({gameId: game.id, playerId: player.id, isOnHomeTeam: true});
                    } else if (player.team_id === game.away.id) {
                        gamesToCheck.push({gameId: game.id, playerId: player.id,isOnHomeTeam: false});
                    }
                });
            }
        });
        this.setNBAGameIdsCovered(coveredIds);
        for(let i = 0; i < gamesToCheck.length; i++) {
            const game = gamesToCheck[i];
            setTimeout(async () => this.sendEmbedMessage(msg, await this.getEmbedForPlayerInGame(game), this.channelId), (i+1) * 3000);
        }
        
    }
}