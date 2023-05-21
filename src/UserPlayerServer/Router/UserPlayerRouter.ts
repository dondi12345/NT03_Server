import { JoinServer } from "../Controller/UserPlayerController";
import { IMSGUserPlayer } from "../Model/MSGUserPlayer";
import { MSGUserPlayerCode } from "../Model/MSGUserPlayerCode";
import { UserPlayer } from "../Model/UserPlayer";

export function UserPlayerRouter(msgUserPlayer : IMSGUserPlayer){
    if(msgUserPlayer.MSGUserPlayerCode == MSGUserPlayerCode.Test){
        console.log("msgUserPlayer Test UserPlayer")
        return;
    }
    if(msgUserPlayer.MSGUserPlayerCode == MSGUserPlayerCode.JoinServer){
        JoinServer(msgUserPlayer);
        return;
    }
}