import { Message } from "../../MessageServer/Model/Message";
import { TransferData } from "../../TransferData";
declare class HeroRouter {
    Router(message: Message, transferData: TransferData): boolean;
}
export declare const heroRouter: HeroRouter;
export {};
