import { Socket } from "socket.io";
import { Message } from "../MessageServer/Model/Message";
declare class TestPerform {
    dataMonster: any;
    Init(): Promise<void>;
    constructor();
    ReadDB(): Promise<any>;
    ReadRedis(): Promise<any>;
    ReadVar(): any;
    Router(message: Message, socket: Socket): Promise<void>;
}
export declare const testPerform: TestPerform;
export {};
