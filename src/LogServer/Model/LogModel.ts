import { LogCode } from "./LogCode";

export enum PlatformCode{
    Unknow = 0,

    IOS = 1,
    Android = 2,
    Window = 3,
}

export class LogModel{
    Code : LogCode;
    IdUserPlayer : string;
    Platform : PlatformCode;
    Data : string;
}