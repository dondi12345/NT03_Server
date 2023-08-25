import { Message } from "../../MessageServer/Model/Message";
import { TransferData } from "../../TransferData";
declare class DataCenterController {
    CheckVersion(message: Message, transferData: TransferData): Promise<void>;
    ReloadData(message: Message, transferData: TransferData): Promise<void>;
    GetDataElementCached(dataName: string, code: string): Promise<{} | null>;
    SetDataElementCached(dataName: string, code: string, data: any): Promise<void>;
}
export declare const dataCenterController: DataCenterController;
export {};
