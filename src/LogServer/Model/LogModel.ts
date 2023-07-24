import { LogCode } from "./LogCode";

export enum PlatformCode{
    Unknow = 0,

    IOS = 1,
    Android = 2,
    Window = 3,
}

export enum LogType{
    Unknow = 0,
    Normal = 1,
    Warning = 2,
    Error = 3,
}

export class LogModel{
    Time : number;
    Date: string;
    Type : LogType;
    Code : LogCode;
    IdUserPlayer : string;
    Platform : PlatformCode;
    Data : string;
}