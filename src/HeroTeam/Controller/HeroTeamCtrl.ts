import { Types } from "mongoose";
import { LogUserSocket, logController } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { IUserSocket, UserSocket } from "../../UserSocket/Model/UserSocket";
import { CreateHeroTeam, FindHeroTeamByIdUserPlayer, HeroTeam, HeroTeamModel, RemoveSlotHeroTeam, SelectHero, UpdateHeroTeam } from "../Model/HeroTeam";
import { LogType } from "../../LogServer/Model/LogModel";
import { TransferData } from "../../TransferData";
import { tokenController } from "../../Token/Controller/TockenController";
import { DataModel } from "../../Utils/DataModel";
import { redisControler } from "../../Service/Database/RedisConnect";
import { RedisKeyConfig } from "../../Enviroment/Env";

export async function HeroTeamLogin(message : Message, userSocket: IUserSocket){
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
        LogUserSocket(LogCode.HeroTeam_SelectHeroFail, userSocket, error, LogType.Error)
    }
}
export async function DeselectHeroTeamCtrl(message : Message, userSocket : UserSocket){
    var selectHero = SelectHero.Parse(message.Data);
    try {
        await FindHeroTeamByIdUserPlayer(userSocket.IdUserPlayer).then((res : HeroTeam)=>{
            if(res == null || res == undefined) return;
            if(res.Slot1?.toString() == selectHero.IdHero){
                res['Slot1'] = "";
            }
            if(res.Slot2?.toString() == selectHero.IdHero){
                res['Slot2'] = "";
            }
            if(res.Slot3?.toString() == selectHero.IdHero){
                res['Slot3'] = "";
            }
            if(res.Slot4?.toString() == selectHero.IdHero){
                res['Slot4'] = "";
            }
            if(res.Slot5?.toString() == selectHero.IdHero){
                res['Slot5'] = "";
            }
            RemoveSlotHeroTeamCtrl(res, userSocket);
        })
    } catch (error) {
        LogUserSocket(LogCode.HeroTeam_SelectHeroFail, userSocket, error, LogType.Error)
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
        LogUserSocket(LogCode.HeroTeam_UpdateFail, userSocket, error, LogType.Error);
    }
}

export function RemoveSlotHeroTeamCtrl(heroTeam : HeroTeam, userSocket : UserSocket){
    try {
        var messageCall = new Message();
        messageCall.MessageCode = MessageCode.HeroTeam_Update;
        messageCall.Data = JSON.stringify(heroTeam);
        UpdateHeroTeamCtrl(messageCall, userSocket);
        RemoveSlotHeroTeam(heroTeam);
    } catch (error) {
        LogUserSocket(LogCode.HeroTeam_RemoveSlotFail, userSocket, error, LogType.Error);
    }
}

class HeroTeamCtrl{
    async HeroTeamLogin(message : Message, transferData: TransferData){
        var tokenUserPlayer = tokenController.AuthenTokenUserPlayer(transferData.Token);
        if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
            transferData.Send(LoginFailMessage())
            return LoginFailMessage();
        }

        var heroTeam = await FindByIdUserPlayer(tokenUserPlayer.IdUserPlayer);

        var message = new Message();
        message.MessageCode = MessageCode.HeroTeam_LoginSuccess;
        message.Data = JSON.stringify(heroTeam);

        transferData.Send(JSON.stringify(message));
    }

    async GetHeroTeamCached(userPlayerID: string) {
        var heroTeamJson = await new Promise(async (reslove, rejects) => {
            reslove(await redisControler.Get(RedisKeyConfig.KeyHeroTeamData(userPlayerID)))
        })
        if (heroTeamJson == null || heroTeamJson == undefined) {
            logController.LogError(LogCode.HeroTeam_NotFoundInCache, userPlayerID, "Server")
            return new HeroTeam();
        }
        return DataModel.Parse<HeroTeam>(heroTeamJson)
    }

    async SetHeroTeamCached(heroTeam: HeroTeam) {
        redisControler.Set(RedisKeyConfig.KeyHeroTeamData(heroTeam.IdUserPlayer), JSON.stringify(heroTeam));
    }
}

export const heroTeamCtrl = new HeroTeamCtrl();

async function FindByIdUserPlayer(idUserPlayer: string) {
    var data;
    await HeroTeamModel.findOne({ IdUserPlayer: idUserPlayer }).then((res) => {
        data = res;
        logController.LogDev("1685077956 Dev ", res)
    }).catch(async err => {
        logController.LogWarring(LogCode.HeroTeam_NotFoundInDB, idUserPlayer + ":" + err, "Server");
        data = null;
    })
    if (data == null || data == undefined) {
        var heroTeam = new HeroTeam();
        heroTeam.IdUserPlayer = new Types.ObjectId(idUserPlayer);
        await HeroTeamModel.create(heroTeam).then(res => {
            data = res;
            logController.LogDev("1685077957 Dev ", res)
        }).catch(err => {
            logController.LogWarring(LogCode.HeroTeam_CreateNewFail, idUserPlayer + ":" + err, "Server");
            data = heroTeam;
        })
    }
    var heroTeam = DataModel.Parse<HeroTeam>(data);
    heroTeamCtrl.SetHeroTeamCached(heroTeam)
    return heroTeam;
}