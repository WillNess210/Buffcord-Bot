import * as discordjs from 'discord.js';
import { LOCAL_DATABASE } from '../..';
import { UserCommand } from '../helpers/UserCommand';
import { MessageListener } from './MessageListener';

const getLastDateCalled = async (messageTriggerName: string): Promise<Date> => {
    const dbItem = await LOCAL_DATABASE.fetchItem<string>(`MT-Date-${messageTriggerName}`);
    if(dbItem) return new Date(dbItem);
    const newDate = new Date();
    newDate.setFullYear(1999);
    return newDate;
}

const setLastDateCalled = async (messageTriggerName: string, date: Date = new Date()) => {
    await LOCAL_DATABASE.setItem(`MT-Date-${messageTriggerName}`, date.toJSON());
}

export class MessageTrigger extends MessageListener {
    name: string; // set to something unique (for database purposes)
    channelId: string; // set to what channel the bot should post in

    async handleMessage(msg: discordjs.Message, userCommand?: UserCommand): Promise<any> {
        console.log(`Undefined message trigger handleMessage in ${this.name}.`)
    }

    async shouldTrigger(msg: discordjs.Message): Promise<boolean> {
        console.log(`Undefined message trigger shouldTrigger in ${this.name}..`);
        return false;
    }
    async onTrigger(msg: discordjs.Message) {
        console.log(`Undefined message trigger onTrigger in ${this.name}..`);
    }

    protected setDailyDateShouldTrigger(timeOfDay: Date) {
        this.shouldTrigger = async (msg: discordjs.Message): Promise<boolean> => {
            const lastCalled = await getLastDateCalled(this.name);
            console.log(`Last called: ${lastCalled.toDateString()}`);
            const today = new Date();
            const todayAtTimeOfDay = new Date(timeOfDay);
            todayAtTimeOfDay.setFullYear(today.getFullYear());
            todayAtTimeOfDay.setMonth(today.getMonth());
            todayAtTimeOfDay.setDate(today.getDate());
            if(new Date() < todayAtTimeOfDay) {
                todayAtTimeOfDay.setDate(todayAtTimeOfDay.getDate() - 1);
            }
            const shouldTrigger = lastCalled < todayAtTimeOfDay;
            if (shouldTrigger) await setLastDateCalled(this.name, new Date());
            return shouldTrigger;
        }
    }

    protected setShouldTriggerEverytime() {
        this.shouldTrigger = async (msg: discordjs.Message): Promise<boolean> => true;
    }
}