import { Message } from "../Model/Message";
import { TransferData } from "../../TransferData";
declare class MessageRouter {
    Router(message: Message, transferData: TransferData): void;
}
export declare const messageRouter: MessageRouter;
export {};
