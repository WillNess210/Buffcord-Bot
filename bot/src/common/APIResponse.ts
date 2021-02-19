import * as discordjs from 'discord.js';

export interface APIResponse<T> {
    status: ResponseStatus;
    error: string;
    data: T;
};

export enum ResponseStatus {
    SUCCESS,
    FAILURE
};

export const getAPIErrorMessage = <T>(resp: APIResponse<T>) => {
    return `Command failed due to API error: ${resp.error}`;
};

export const getAPISuccess = <T>(data: T): APIResponse<T> => {
    return {
        status: ResponseStatus.SUCCESS,
        error: '',
        data
    };
};