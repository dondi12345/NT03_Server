import { Register } from "../Controller/UserPlayerController";
import { IMSGUserPlayer } from "../Model/MSGUserPlayer";
import { MSGUserPlayerCode } from "../Model/MSGUserPlayerCode";

export function UserPlayerRouter(msgUserPlayer : IMSGUserPlayer){
    if(msgUserPlayer.MSGUserPlayerCode == MSGUserPlayerCode.Test){
        console.log("msgUserPlayer Test UserPlayer")
    }
    if(msgUserPlayer.MSGUserPlayerCode == MSGUserPlayerCode.Register){
        Register(msgUserPlayer);
    }
}