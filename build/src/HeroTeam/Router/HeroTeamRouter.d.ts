import { Message } from "../../MessageServer/Model/Message";
import { TransferData } from "../../TransferData";
declare class HeroTeamRouter {
    Router(message: Message, transferData: TransferData): void;
}
export declare const heroTeamRouter: HeroTeamRouter;
export {};
