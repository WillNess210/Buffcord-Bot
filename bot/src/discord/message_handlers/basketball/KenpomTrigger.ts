import * as discordjs from 'discord.js';
import { KENPOM_MANAGER } from '../../..';
import { KenpomResult } from '../../../apis/kenpom/models';
import { MessageTrigger } from "../MessageTrigger";

export class KenpomTrigger extends MessageTrigger {
    name = "KenpomTracker";
    key: string;
    channelId: string;

    schools: string[];

    constructor(channelId: string) {
        super();

        const dateShouldTrigger = new Date(); // 8 AM
        dateShouldTrigger.setHours(7);
        dateShouldTrigger.setMinutes(0),
        dateShouldTrigger.setSeconds(0, 0);
        this.setDailyDateShouldTrigger(dateShouldTrigger);


        this.key = this.name + "kenpom2";
        this.channelId = channelId;
        this.schools = [
            "Colorado",
            "Utah",
            "Stanford",
            "California",
            "Arizona",
            "Arizona St.",
            "Washington",
            "Washington St.",
            "Oregon",
            "Oregon St.",
            "USC",
            "UCLA",
            "Colorado St.",
            "Syracuse",
            "Duke",
            "George Mason",
            "Drake",
            "Northern Colorado",
            "Denver",
            "LSU",
            "Michigan St.",
            "Creighton",
            "Tulsa"
        ]
    }

    private formatResults = (results: KenpomResult[]): string => {
        return `**Current Kenpom Rankings:**\n` + results.map((result: KenpomResult) => result.schoolName === 'Colorado' ? `**${result.rank}. ${result.schoolName}**` : `${result.rank}. ${result.schoolName}`).join('\n');
    }

    async onTrigger(msg: discordjs.Message) {
        const results = await KENPOM_MANAGER.getKenpomStandings(this.schools);
        this.sendTextMessage(msg, this.formatResults(results), this.channelId);
    }
}
