import { DiscordEmoji } from "../discord/DiscordEmoji";
import { DiscordColor } from "../discord/helpers/Color";

export enum College {
    colorado,
    utah,
    oregon,
    oregon_state,
    washington,
    washington_state,
    stanford,
    cal,
    usc,
    ucla,
    arizona,
    arizona_state,
    colorado_state,
    alabama
}

export interface CollegeInformation {
    name: string;
    short: string;
    color: DiscordColor;
    college: College;
    logo_url: string;
    emoji?: DiscordEmoji;
    fbId?: string;
    bbId?: string;
}