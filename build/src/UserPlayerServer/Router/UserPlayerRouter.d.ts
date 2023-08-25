import { Message } from "../../MessageServer/Model/Message";
import { TransferData } from "../../TransferData";
declare class UserPlayerRouter {
    Router(message: Message, transferData: TransferData): boolean;
}
export declare const userPlayerRouter: UserPlayerRouter;
export {};
