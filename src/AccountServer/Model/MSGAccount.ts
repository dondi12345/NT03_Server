import { Types } from "mongoose";
import { MSGAccountCode } from "./MSGAccountCode";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";


export interface IMSGAccount{
    MSGAccountCode : MSGAccountCode;
    IdAccount?: Types.ObjectId,
    Socket : Socket,
    Data : any;
}

export class MSGAccount implements IMSGAccount {
    MSGAccountCode: MSGAccountCode;                              
    IdAccount: Types.ObjectId = new Types.ObjectId("012345678910111213141516");
    Socket: Socket;
    Data: any;

    constructor() {
        
    }

    static Parse(data) : MSGAccount{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }

    static ToString(msgAccount : IMSGAccount){
        var data = new MSGAccount();
        data.MSGAccountCode = msgAccount.MSGAccountCode;
        if(msgAccount.IdAccount != null && msgAccount.IdAccount != undefined)
            data.IdAccount = msgAccount.IdAccount;
        data.Data = msgAccount.Data;
        return JSON.stringify(data);
    }
}