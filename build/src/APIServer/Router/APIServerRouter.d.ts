import { Message } from "../../MessageServer/Model/Message";
import { TransferData } from "../../TransferData";
declare class APIServerRouter {
    Router(message: Message, transferData: TransferData): void;
}
export declare const apiServerRouter: APIServerRouter;
export {};
