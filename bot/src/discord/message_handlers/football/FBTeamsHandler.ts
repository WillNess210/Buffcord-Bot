import * as discordjs from 'discord.js';
import { DEFAULT_TEAM, DISCORD_CHANNEL_IDS, FOOTBALL_MANAGER } from '../../..';
import { COLLEGE_SHORT_MAP } from '../../../colleges/info';
import { CollegeInformation } from '../../../colleges/model';
import { UserCommand } from '../../helpers/UserCommand';
import { MessageHandler } from '../MessageHandler';

export class FBTeamsHandler extends MessageHandler {
    commandString = 'teams';
    description = 'Displays all teams in our system.';
    channels = [...DISCORD_CHANNEL_IDS.football];


    private getCollegeInformationAsString = (college: CollegeInformation): string => {
        const str = `${FOOTBALL_MANAGER.getEmojiForTeamId(college.fbId)} ${college.name}: ${college.short}`;
        return college.college === DEFAULT_TEAM.college
            ? `**${str}**`
            : str;

    }

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand) {
        const msg_resp = Object.keys(COLLEGE_SHORT_MAP)
            .map((short: string) => COLLEGE_SHORT_MAP[short])
            .sort((a: CollegeInformation, b: CollegeInformation) => a.name > b.name ? 1 : -1)
            .map(this.getCollegeInformationAsString)
            .join('\n');
        this.sendTextMessage(msg, msg_resp);
    }
}