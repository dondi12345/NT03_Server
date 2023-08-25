import { Message } from "../../MessageServer/Model/Message";
import { TransferData } from '../../TransferData';
declare class AccountController {
    AccountRegister(message: Message, transferData: TransferData): Promise<void>;
    AccountLogin(message: Message, transferData: TransferData): Promise<void>;
}
export declare const accountController: AccountController;
export {};
