export enum all_emojis {
    colorado,
    evan,
    kin,
    utah,
    washington,
    washington_state,
    oregon,
    oregon_state,
    stanford,
    cal,
    usc,
    ucla,
    arizona,
    arizona_state,
    colorado_state,
    alabama,
    basketball
};

export const EMOJI_MAP: { [key in all_emojis]: string;} = {
    [all_emojis.colorado]: '<:cu:807337700511186945>',
    [all_emojis.evan]: '<:evan:807340159968346132>',
    [all_emojis.kin]: '<:kin:807341235823312917>',
    [all_emojis.utah]: '<:utah:812374659391029259>',
    [all_emojis.washington]: '<:washington:812374668668305438>',
    [all_emojis.washington_state]: '<:washington_state:812374680660082749>',
    [all_emojis.oregon]: '<:oregon:812375466253353060>',
    [all_emojis.oregon_state]: '<:oregon_state:812374611048005644>',
    [all_emojis.stanford]: '<:stanford:812374631364689950>',
    [all_emojis.cal]: '<:cal:812374600443756595>',
    [all_emojis.usc]: '<:usc:812374649953452062>',
    [all_emojis.ucla]: '<:ucla:812374642039455795>',
    [all_emojis.arizona]: '<:arizona:812374578470715402>',
    [all_emojis.arizona_state]: '<:asu:812374591397560411>',
    [all_emojis.colorado_state]: '<:CSU:807341940156006411>',
    [all_emojis.alabama]: ':poop:',
    [all_emojis.basketball]: ':basketball:'
};