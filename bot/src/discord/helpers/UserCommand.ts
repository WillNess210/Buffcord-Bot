export interface UserCommand {
    command: string;
    args: string[];
}

export const messageContentToUserCommand = (commandPrefix: string, msg: string): UserCommand => {
    const msgSplit = msg.substr(commandPrefix.length).split(' '); // strip prefix then split by space
    return {
        command: msgSplit[0].toLowerCase(),
        args: msgSplit.length === 1 ? [] : msgSplit.slice(1)
    };
};