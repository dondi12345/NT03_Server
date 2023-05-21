import { UserJoinToGlobalChannel } from "../../ChatServer/Model/UserChatChannel";
import { IMSGUserPlayer, MSGUserPlayer } from "../Model/MSGUserPlayer";
import { MSGUserPlayerCode } from "../Model/MSGUserPlayerCode";
import { ServerGameCode } from "../Model/ServerGameCode";
import { CreateUserPlayer, FindByIdAccountAndServerGameCode, IUserPlayer, UserPlayer } from "../Model/UserPlayer";
import { SendToSocket } from "../Service/UserPlayerService";

export async function JoinServer(msgUserPlayer : IMSGUserPlayer){
    var userPlayer = UserPlayer.Parse(msgUserPlayer.Data);
    if(!(userPlayer.ServerGameCode in ServerGameCode)) return;
    await FindByIdAccountAndServerGameCode(userPlayer.IdAccount, userPlayer.ServerGameCode).then(res=>{
        if(res == null || res == undefined){
            CreateUserPlayer(userPlayer).then(res=>{
                if(res == null || res == undefined){
                    var backMSGUserPlayer = new MSGUserPlayer();
                    backMSGUserPlayer.Socket = msgUserPlayer.Socket;
                    backMSGUserPlayer.MSGUserPlayerCode = MSGUserPlayerCode.JoinFail;
                    SendToSocket(backMSGUserPlayer, msgUserPlayer.Socket);
                }else{
                    userPlayer = UserPlayer.Parse(res);
                    var backMSGUserPlayer = new MSGUserPlayer();
                    backMSGUserPlayer.IdUserPlayer = userPlayer._id;
                    backMSGUserPlayer.Socket = msgUserPlayer.Socket;
                    backMSGUserPlayer.Data = UserPlayer.ToString(userPlayer);
                    backMSGUserPlayer.MSGUserPlayerCode = MSGUserPlayerCode.JoinCreateUserPlayer;
                    UserJoinToGlobalChannel(userPlayer._id, userPlayer.ServerGameCode);
                    SendToSocket(backMSGUserPlayer, msgUserPlayer.Socket);
                }
            })
        }else{
            userPlayer = UserPlayer.Parse(res);
            var backMSGUserPlayer = new MSGUserPlayer();
            backMSGUserPlayer.IdUserPlayer = userPlayer._id;
            backMSGUserPlayer.Socket = msgUserPlayer.Socket;
            backMSGUserPlayer.MSGUserPlayerCode = MSGUserPlayerCode.JoinSucces;
            SendToSocket(backMSGUserPlayer, msgUserPlayer.Socket);
        }
    })
}