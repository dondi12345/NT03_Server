import { Types } from "mongoose";
import { MSGUserPlayerCode } from "./MSGUserPlayerCode";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";


export interface IMSGUserPlayer{
    MSGUserPlayerCode : MSGUserPlayerCode;
    IdUserPlayer?: Types.ObjectId,
    Socket : Socket,
    Data : any;
}

export class MSGUserPlayer implements IMSGUserPlayer {
    MSGUserPlayerCode: MSGUserPlayerCode;                              
    IdUserPlayer: Types.ObjectId = new Types.ObjectId("012345678910111213141516");
    Socket: Socket;
    Data: any;

    constructor() {
        
    }

    static Parse(data) : MSGUserPlayer{
        try{
            return JSON.parse(data);
        }catch{
            return data;
        }
    }

    static ToString(msgUserPlayer : IMSGUserPlayer){
        var data = new MSGUserPlayer();
        data.MSGUserPlayerCode = msgUserPlayer.MSGUserPlayerCode;
        if(msgUserPlayer.IdUserPlayer != null && msgUserPlayer.IdUserPlayer != undefined)
            data.IdUserPlayer = msgUserPlayer.IdUserPlayer;
        data.Data = msgUserPlayer.Data;
        return JSON.stringify(data);
    }
}