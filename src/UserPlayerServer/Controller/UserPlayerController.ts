import { UserJoinToGlobalChannel } from "../../ChatServer/Model/UserChatChannel";
import { SendToSocket } from "../Master/UserPlayerMaster";
import { IMSGUserPlayer, MSGUserPlayer } from "../Model/MSGUserPlayer";
import { MSGUserPlayerCode } from "../Model/MSGUserPlayerCode";
import { CreateUserPlayer, FindByUserName, IUserPlayer, UserPlayer, UserPlayerModel } from "../Model/UserPlayer";
import bcrypt from 'bcrypt'
const saltRounds = 10;

export async function Register(msgUserPlayer : IMSGUserPlayer){
    try {
        var userPlayer = UserPlayer.Parse(msgUserPlayer.Data);
        
        var isExisten = false;
        await FindByUserName(userPlayer).then(res=>{
            if(res == null || res == undefined) return;
            console.log("1684663921 User Existen")
            var backMSGUserPlayer = new MSGUserPlayer();
            backMSGUserPlayer.MSGUserPlayerCode = MSGUserPlayerCode.User_Existen;
            backMSGUserPlayer.Socket = msgUserPlayer.Socket;
            SendToSocket(backMSGUserPlayer, msgUserPlayer.Socket);
            isExisten = true;
        })
        if(isExisten) return;

        if(userPlayer.Password == null || userPlayer.Password == undefined) return;
        var pass = userPlayer.Password == undefined ? "" : userPlayer.Password+"";
        bcrypt.hash(pass, saltRounds, function(err, hash) {
            userPlayer.Password = hash;
            CreateUserPlayer(userPlayer).then((res: IUserPlayer)=>{
                console.log("1684646335 "+ res);
                UserJoinToGlobalChannel(res._id);

                var backMSGUserPlayer = new MSGUserPlayer();
                backMSGUserPlayer.MSGUserPlayerCode = MSGUserPlayerCode.Register_Successful;
                backMSGUserPlayer.Socket = msgUserPlayer.Socket;
                SendToSocket(backMSGUserPlayer, msgUserPlayer.Socket);
            })
        });
    } catch (error) {
        console.log("1684641453 "+error);
    }
}