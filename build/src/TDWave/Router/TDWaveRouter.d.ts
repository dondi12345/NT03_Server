import { Message } from "../../MessageServer/Model/Message";
import { TransferData } from "../../TransferData";
declare class TDWaveRouter {
    Router(message: Message, transferData: TransferData): boolean;
}
export declare const tdWaveRouter: TDWaveRouter;
export {};
