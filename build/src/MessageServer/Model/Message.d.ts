import { MessageCode } from "./MessageCode";
export declare class Message {
    MessageCode: MessageCode;
    Data: any;
    Token: string;
    constructor();
    static Parse(data: any): Message;
}
