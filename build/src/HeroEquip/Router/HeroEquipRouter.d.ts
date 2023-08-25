import { Message } from "../../MessageServer/Model/Message";
import { TransferData } from "../../TransferData";
declare class HeroEquipRouter {
    Router(message: Message, transferData: TransferData): void;
}
export declare const heroEquipRouter: HeroEquipRouter;
export {};
