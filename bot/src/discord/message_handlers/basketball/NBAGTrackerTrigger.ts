import * as discordjs from 'discord.js';
import { DEFAULT_TEAM, NBAG_MANAGER } from '../../..';
import { MessageTrigger } from '../MessageTrigger';

export class NBAGTrackerTrigger extends MessageTrigger {
    name = "NBAGTracker";
    key: string;
    channelId: string;

    constructor(channelId: string) {
        super();
        this.setShouldTriggerEverytime();
    }

    async onTrigger(msg: discordjs.Message) {
        const trackedPlayers = await NBAG_MANAGER.getAllPlayersFromCollege(DEFAULT_TEAM.name);
        // putting a hold on this bc reg season doesn't start until end of year
    }
}