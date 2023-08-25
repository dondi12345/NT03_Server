import { PlatformCode } from "../../LogServer/Model/LogModel";
export interface ITockenAuthen {
    Token: String;
    IdDevice: String;
    Platform: PlatformCode;
}
export declare class TockenAuthen implements ITockenAuthen {
    Token: String;
    IdDevice: String;
    Platform: PlatformCode;
    constructor();
    static Parse(data: any): ITockenAuthen;
}
