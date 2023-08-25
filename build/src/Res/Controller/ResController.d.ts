import { Message } from "../../MessageServer/Model/Message";
import { IUserSocket } from "../../UserSocket/Model/UserSocket";
import { Res } from "../Model/Res";
import { ResCode } from "../Model/ResCode";
export declare function ResLogin(message: Message, userSocket: IUserSocket): Promise<void>;
export declare function ChangeRes(code: ResCode, number: number, userSocket: IUserSocket): Promise<boolean>;
export declare function CreateNewRes(resCode: ResCode, userSocket: IUserSocket): Promise<Res>;
export declare function UpdateResCtrl(res: Res, userSocket: IUserSocket): Promise<void>;
