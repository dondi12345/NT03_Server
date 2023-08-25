import { UserSocket } from "../../UserSocket/Model/UserSocket";
import { LogCode } from "../Model/LogCode";
import { LogType } from "../Model/LogModel";
export declare function LogUserSocket(logCode: LogCode, userSocket: UserSocket, data?: string, type?: LogType): void;
export declare function LogIdUserPlayer(logCode: LogCode, idUserPlayer: string, data?: string, type?: LogType): void;
export declare function LogServer(logCode: LogCode, data?: string, type?: LogType): void;
export declare function LogFromClient(log: string): void;
declare class LogController {
    LogDev(...str: any[]): void;
    LogMessage(logCode: LogCode, data: any, token: string): void;
    LogWarring(logCode: LogCode, data: any, token: string): void;
    LogError(logCode: LogCode, data: any, token: string): void;
}
export declare const logController: LogController;
export {};
