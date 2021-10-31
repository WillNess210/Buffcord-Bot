export default interface Environment {
    DISCORD_CLIENT_SECRET: string;
    DISCORD_BOT_TOKEN: string;
    BB_SPORTSRADAR_TOKEN: string;
    NBA_SPORTSRADAR_TOKEN: string;
    FB_SPORTSRADAR_TOKEN: string;
    COMMAND_PREFIX: string;
    DISCORD_GUILD_ID: string;
    DISCORD_CHANNEL_BASKETBALL: string;
    DISCORD_CHANNEL_FOOTBALL: string;
    DISCORD_CHANNEL_ADMIN: string;
    DISCORD_CHANNEL_NBA: string;
    ENV: "dev" | "prod";
}