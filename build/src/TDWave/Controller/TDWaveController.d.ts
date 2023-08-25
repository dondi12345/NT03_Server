import { Message } from "../../MessageServer/Model/Message";
import { TransferData } from "../../TransferData";
declare class TDWaveController {
    ProtectedSuccessCtrl(message: Message, transferData: TransferData): Promise<void>;
    ProtectedFailCtrl(message: Message, transferData: TransferData): void;
}
export declare const tdWaveController: TDWaveController;
export {};
