import * as discordjs from "discord.js";
import { Schools, SCHOOL_MAP } from "../../basketball/models/Team";

export interface EmbedMessage {
    title?: string;
    description?: string;
    url?: string;
    color?: number; // integer
    timestamp?: Date;
    footer?: EmbedFooter;
    thumbnail?: EmbedThumbnail;
    image?: EmbedImage;
    author?: EmbedAuthor;
    fields?: EmbedField[];
}

interface EmbedFooter {
    icon_url?: string;
    text?: string;
}

interface EmbedThumbnail {
    url: string;
    height?: number;
    width?: number;
}

interface EmbedImage {
    url: string;
    height?: number;
    width?: number;
}

interface EmbedAuthor {
    name?: string;
    url?: string;
    icon_url?: string;
}

interface EmbedField {
    title?: string;
    value?: string;
    inline?: boolean;
}

export const getDiscordJSEmbedObject = (embed: EmbedMessage): discordjs.MessageEmbed | string => {
    if (embed.description.length > 2000) {
        return embed.description;
    }
    return new discordjs.MessageEmbed({
        author: embed.author && {
            name: embed.author.name,
            url: embed.author.url,
            iconURL: embed.author.icon_url
        },
        color: embed.color,
        description: embed.description,
        fields: embed.fields && embed.fields.map((field: EmbedField) => {
            return {
                name: field.title,
                value: field.value,
                inline: field.inline
            } as discordjs.EmbedField;
        }),
        footer: embed.footer && {
            text: embed.footer.text,
            iconURL: embed.footer.icon_url
        } || {
            text: "Buffcord",
            icon_url: SCHOOL_MAP[Schools.colorado].logo_url
        },
        image: embed.image && {
            url: embed.image.url,
            height: embed.image.height,
            width: embed.image.width,
        },
        thumbnail: embed.thumbnail && {
            url: embed.thumbnail.url,
            height: embed.thumbnail.height,
            width: embed.thumbnail.width,
        },
        timestamp: embed.timestamp.getTime(),
        title: embed.title,
        url: embed.url,
    });
};

export const BLANK_EMBED_FIELD: EmbedField = {
    title: '\u200B',
    value: '\u200B',
    inline: true
}