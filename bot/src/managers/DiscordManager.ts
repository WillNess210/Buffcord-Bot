import { Channel, GuildMember, Message, TextChannel } from "discord.js";
import { DiscordBot } from "../discord/DiscordBot";

export default class DiscordManager {
    private bot: DiscordBot;
    constructor (bot: DiscordBot) {
        this.bot = bot;
    }

    public getLastMessagedUserMap = async(): Promise<{[userName: string]: string;}> => {
        const allUsers = await this.getAllUsers();
        const userMap: {[key: string]: number | null;} = {};
        allUsers.forEach((user: GuildMember) => userMap[user.id] = null);
        const messageFn = (message: Message) => {
            if (userMap[message.author.id] === null) {
                userMap[message.author.id] = message.createdTimestamp;
            } else if (message.createdTimestamp > userMap[message.author.id]){
                userMap[message.author.id] = message.createdTimestamp;
            }
        }
        await this.runOnAllMessages(messageFn);
        const now = new Date().getTime();
        const formattedMap = {};
        allUsers.forEach((user: GuildMember) => {
            const userName = user.displayName;
            if (userMap[user.id] === null) {
                formattedMap[userName] = "Never messaged.";
                return;
            }
            let timeDifference = now - userMap[user.id];
            const daysDifference = Math.floor(timeDifference/1000/60/60/24)
            timeDifference -= daysDifference*1000*60*60*24

            const hoursDifference = Math.floor(timeDifference/1000/60/60);
            timeDifference -= hoursDifference*1000*60*60

            const minutesDifference = Math.floor(timeDifference/1000/60);
            timeDifference -= minutesDifference*1000*60

            const secondsDifference = Math.floor(timeDifference/1000);
            formattedMap[userName] = `Last messaged ${daysDifference} days ${hoursDifference} hours ${minutesDifference} minutes ${secondsDifference} seconds ago.`;
        });
        return formattedMap;
    }

    private runOnAllMessages = async(
        messageFn: (message: Message) => any
    ) => {
        const channels = await this.getAllChannels();
        for (let i = 0; i < channels.length; i++) {
            await this.runOnAllMessagesForChannel(channels[i], messageFn);
        }
    }

    private runOnAllMessagesForChannel = async (
        channel: TextChannel,
        messageFn: (message: Message) => any
    ): Promise<Message[]> => {
        const first_message = await this.getFirstMessageInChannel(channel);
        messageFn(first_message);
        let lastMessage: Message = first_message;
        while(true) {
            const next_batch = await this.getMessagesBeforeMessage(
                channel,
                lastMessage
            );
            if (next_batch.length === 0) {
                return;
            }
            lastMessage = next_batch[next_batch.length - 1];
            next_batch.forEach(messageFn);
        }
    }

    private getFirstMessageInChannel = async (channel: TextChannel): Promise<Message> => {
        let first_message = {} as Message;
        const channel_messages = await channel.messages.fetch({limit: 1});
        channel_messages.forEach((message: Message) => {
            first_message = message;
        });
        return first_message;
    }

    private getMessagesBeforeMessage = async (channel: TextChannel, lastMessage: Message): Promise<Message[]> => {
        const messages: Message[] = [];
        const channel_messages = await channel.messages.fetch({limit: 100, before: lastMessage.id});
        channel_messages.forEach((message: Message) => messages.push(message));
        return messages;
    }

    private getAllChannels = async (): Promise<TextChannel[]> => {
        const channels: TextChannel[] = [];
        this.bot.buffcord.channels.cache
            .filter((channel: Channel) => channel.isText())
            .forEach((channel: Channel) => {
                channels.push(channel as TextChannel);
            });
        return channels;
    }

    public getAllUsers = async(): Promise<GuildMember[]> => {
        const members: GuildMember[] = [];
        const memberManager = this.bot.buffcord.members;
        (await memberManager.fetch({limit: 1000})).forEach((member: GuildMember) => members.push(member));
        console.log('Got members');
        return members;
    }
}