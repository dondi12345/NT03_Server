import { Message } from "../../MessageServer/Model/Message";
import { UserSocket } from "../../UserSocket/Model/UserSocket";
import { UserPlayer } from "../Model/UserPlayer";
import { TransferData } from '../../TransferData';
export declare function UpdateUserPlayerCtrl(userSocket: UserSocket): void;
declare class UserPlayerController {
    UserPlayerLogin(message: Message, transferData: TransferData): void;
    UserPlayerLogout(message: Message): void;
    GetUserPlayerCached(token: string): Promise<UserPlayer | null>;
    SetUserPlayerCached(token: string, userPlayer: UserPlayer): Promise<void>;
    UserPlayerChangeAdd(data: any, token: any): Promise<any>;
}
export declare const userPlayerController: UserPlayerController;
export {};
