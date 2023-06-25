import { LogUserSocket } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { IMessage, Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { IUserSocket, UserSocket } from "../../UserSocket/Model/UserSocket";
import { CreateHeroTeam, FindHeroTeamByIdUserPlayer, HeroTeam, HeroTeamModel, SelectHero, UpdateHeroTeam } from "../Model/HeroTeam";

export async function HeroTeamLogin(message : IMessage, userSocket: IUserSocket){
    await FindHeroTeamByIdUserPlayer(userSocket.IdUserPlayer).then(async (respone)=>{
        if(respone == null || respone == undefined){
            var heroTeam = new HeroTeam();
            heroTeam.IdUserPlayer = userSocket.IdUserPlayer;
            await CreateHeroTeam(heroTeam).then(respone=>{
                console.log("Dev 1684837964 " + respone)
                userSocket.HeroTeam = respone;
                SendMessageToSocket(LoginSuccessMessage(userSocket.HeroTeam), userSocket.Socket);
            }).catch(()=>{
                LoginFail(userSocket);
            })
        }else{
            console.log("Dev 1684837893 " + respone)
            userSocket.HeroTeam = respone;
            SendMessageToSocket(LoginSuccessMessage(userSocket.HeroTeam), userSocket.Socket);
        }
    }).catch(()=>{
        LoginFail(userSocket);
    })
}

function LoginFail(userSocket: IUserSocket){
    SendMessageToSocket(LoginFailMessage(), userSocket.Socket);
}

function LoginFailMessage(){
    var message = new Message();
    message.MessageCode = MessageCode.HeroTeam_LoginFail;
    return message;
}
function LoginSuccessMessage(heroTeam : HeroTeam){
    var message = new Message();
    message.MessageCode = MessageCode.HeroTeam_LoginSuccess;
    message.Data = JSON.stringify(heroTeam);
    return message;
}

export async function SelectHeroTeamCtrl(message : Message, userSocket : UserSocket){
    var selectHero = SelectHero.Parse(message.Data);
    try {
        await FindHeroTeamByIdUserPlayer(userSocket.IdUserPlayer).then((res : HeroTeam)=>{
            if(res == null || res == undefined) return;
            if(selectHero.IndexSlot == 1){
                res.Slot1 = selectHero.IdHero;
            }
            if(selectHero.IndexSlot == 2){
                res.Slot2 = selectHero.IdHero;
            }
            if(selectHero.IndexSlot == 3){
                res.Slot3 = selectHero.IdHero;
            }
            if(selectHero.IndexSlot == 4){
                res.Slot4 = selectHero.IdHero;
            }
            if(selectHero.IndexSlot == 5){
                res.Slot5 = selectHero.IdHero;
            }
            var messageCall = new Message();
            messageCall.MessageCode = MessageCode.HeroTeam_Update;
            messageCall.Data = JSON.stringify(res);
            UpdateHeroTeamCtrl(messageCall, userSocket);
        })
    } catch (error) {
        LogUserSocket(LogCode.HeroTeam_SelectHeroFail, userSocket, error)
    }
}
export async function DeselectHeroTeamCtrl(message : Message, userSocket : UserSocket){
    var selectHero = SelectHero.Parse(message.Data);
    try {
        await FindHeroTeamByIdUserPlayer(userSocket.IdUserPlayer).then((res : HeroTeam)=>{
            if(res == null || res == undefined) return;
            if(res.Slot1 === selectHero.IdHero){
                res.Slot1 = "";
            }
            if(res.Slot2 === selectHero.IdHero){
                res.Slot2 = "";
            }
            if(res.Slot3 === selectHero.IdHero){
                res.Slot3 = "";
            }
            if(res.Slot4 === selectHero.IdHero){
                res.Slot4 = "";
            }
            if(res.Slot5 === selectHero.IdHero){
                res.Slot5 = "";
            }
            var messageCall = new Message();
            messageCall.MessageCode = MessageCode.HeroTeam_Update;
            messageCall.Data = JSON.stringify(res);
            UpdateHeroTeamCtrl(messageCall, userSocket);
        })
    } catch (error) {
        LogUserSocket(LogCode.HeroTeam_SelectHeroFail, userSocket, error)
    }
}

export function UpdateHeroTeamCtrl(message : Message, userSocket : UserSocket){
    try {
        var heroTeam = HeroTeam.Parse(message.Data);
        UpdateHeroTeam(heroTeam);
        var messageBack = new Message();
        messageBack.MessageCode = MessageCode.HeroTeam_Update;
        messageBack.Data = JSON.stringify(heroTeam);
        SendMessageToSocket(messageBack, userSocket.Socket);
    } catch (error) {
        LogUserSocket(LogCode.HeroTeam_UpdateFail, userSocket, error);
    }
}
