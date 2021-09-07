import * as discordjs from 'discord.js';
import { DISCORD_CHANNEL_IDS, DISCORD_MANAGER } from '../../..';
import { UserCommand } from '../../helpers/UserCommand';
import { MessageHandler } from "../MessageHandler";

export class LastMessagedHandler extends MessageHandler {
    commandString = 'lastmessaged';
    description = `Outputs the last team each member sent a message`;
    channels = [...DISCORD_CHANNEL_IDS.admin];

    async handleMessage (msg: discordjs.Message, userCommand: UserCommand): Promise<any> {
        this.sendTextMessage(msg, "This might take a bit. Please do not retry the command again anytime soon. If it's been an hour and no response, let will know.");
        // const lastMessagedMap = await DISCORD_MANAGER.getLastMessagedUserMap();
        // this.sendTextMessage(msg, Object.keys(lastMessagedMap).map((username: string): string => {
        //     return `${username}: ${lastMessagedMap[username]}`;
        // }).join('\n'));
        const members = await DISCORD_MANAGER.getAllUsers();
        this.sendTextMessage(msg, members.map(member => member.displayName).join('\n'));
    }

}
