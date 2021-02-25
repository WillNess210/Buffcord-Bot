interface DiscordColorRGB {
    r: number;
    g: number;
    b: number;
}

export class DiscordColor {
    private color: DiscordColorRGB;
    constructor(r: number, g: number, b: number) {
        this.color = {
            r,
            g,
            b
        };
    }

    public getInt() {
        return DiscordColorToInt(this.color);
    }
}

 const DiscordColorToInt = (color: DiscordColorRGB) => (color.r << 16) + (color.g << 8) + (color.b);