const monthStrs = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

export const ReadableDate = (date: Date): string => 
    date ? `${monthStrs[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`
    : '?';

export const ReadableDateShort = (date: Date): string => 
    date ? `${monthStrs[date.getMonth()]} ${date.getDate()} ${(date.getFullYear() + '').substr(2,2)}`
    : '?';

export const SportsDataDate = (date: Date): string =>
    `${date.getFullYear()}-${monthStrs[date.getMonth()].toUpperCase()}-${date.getDate()}`;

export const OnSameDay = (a: Date, b : Date): boolean =>
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();