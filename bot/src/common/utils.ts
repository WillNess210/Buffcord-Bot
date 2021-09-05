export const getHeightString = (heightInches: number): string => {
    const heightFeet = Math.floor(heightInches / 12);
    return `${heightFeet}'${heightInches - heightFeet * 12}"`;
}

const fbPlayerStatusToDescriptionMap = {
    ACT: "Active",
    EXE: "Exempt",
    NWT: "Not with Team",
    PRA: "Practice Squad",
    SUS: "Suspended"
};

export const footballPlayerStatusToDescription = (status: string): string => {
    return status in fbPlayerStatusToDescriptionMap ?
        fbPlayerStatusToDescriptionMap[status]
        : status;
}

const fbPositionDescriptionMap = {
    C: "Center",
    CB: "Cornerback",
    DB: "Defensive Back",
    DE: "Defensive End",
    DL: "Defensive Lineman",
    DT: "Defensive Tackle",
    FB: "Fullback",
    FS: "Free Safety",
    G: "Guard",
    ILB: "Inside Linebacker",
    K: "Kicker",
    KR: "Kick Returner",
    LB: "Linebacker",
    LS: "Long Snapper",
    MLB: "Middle Linebacker",
    NT: "Nose Tackle",
    OL: "Offensive Lineman",
    OLB: "Outside Linebacker",
    P: "Punter",
    QB: "Quarterback",
    RB: "Running Back",
    S: "Safety",
    SS: "Strong Safety",
    T: "Tackle",
    TE: "Tight End",
    WR: "Wide Receiver"
};

export const footballPlayerPositionToDescription = (position: string): string => {
    return position in fbPositionDescriptionMap ?
        fbPositionDescriptionMap[position]
        : position;
}

export const locationStripUSA = (location: string): string => {
    const ending = ", USA";
    if (location.length <= ending.length + 1) return location;
    const splitIndex = location.length - ending.length;
    return location.substr(splitIndex) === ending
        ? location.substr(0, splitIndex)
        : location;
}