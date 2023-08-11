import { UpdateCurrencyCtrl, currencyController } from "../../Currency/Controller/CurrencyController";
import { LogUserSocket, logController } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { LogType } from "../../LogServer/Model/LogModel";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { ChangeRes } from "../../Res/Controller/ResController";
import { ResCode } from "../../Res/Model/ResCode";
import { TransferData } from "../../TransferData";
import { UpdateUserPlayerCtrl, userPlayerController } from "../../UserPlayerServer/Controller/UserPlayerController";
import { UserPlayer } from "../../UserPlayerServer/Model/UserPlayer";
import { UserSocket } from "../../UserSocket/Model/UserSocket";
import { DataModel } from "../../Utils/DataModel";
import { TDWaveReward5Lv, TDWaveRewardGrow5Lv, TDWaveRewardGrowLv, TDWaveRewardLv } from "./TDWaveData";

export function ProtectedSuccessCtrl(message : Message, userSocket : UserSocket) {
    //Reward
    LogUserSocket(LogCode.TDWave_ProtectedSuccess, userSocket, "", LogType.Normal);
    if(userSocket.UserPlayer.Wave == undefined || userSocket.UserPlayer.Wave == null){
        userSocket.UserPlayer.Wave = 0;
    }
    if(userSocket.UserPlayer.Wave % 5 == 0){
        userSocket.Currency.Money += TDWaveRewardLv.Money + TDWaveRewardGrowLv.Money * userSocket.UserPlayer.Wave;
        userSocket.Currency.Food += TDWaveRewardLv.Food + TDWaveRewardGrowLv.Food * userSocket.UserPlayer.Wave;
        UpdateCurrencyCtrl(userSocket);
    }else{
        userSocket.Currency.Money += TDWaveReward5Lv.Money + TDWaveRewardGrow5Lv.Money * userSocket.UserPlayer.Wave;
        userSocket.Currency.Food += TDWaveReward5Lv.Food + TDWaveRewardGrow5Lv.Food * userSocket.UserPlayer.Wave;
        UpdateCurrencyCtrl(userSocket);
        var heroScroll_White = Math.floor(TDWaveReward5Lv.HeroScroll_White + TDWaveRewardGrow5Lv.HeroScroll_White * userSocket.UserPlayer.Wave);
        var blueprintHeroEquip_White = Math.floor(TDWaveReward5Lv.BlueprintHeroEquip_White + TDWaveRewardGrow5Lv.BlueprintHeroEquip_White * userSocket.UserPlayer.Wave);
        ChangeRes(ResCode.HeroScroll_White, heroScroll_White, userSocket);
        ChangeRes(ResCode.BlueprintHeroEquip_White, blueprintHeroEquip_White, userSocket);
    }
    //Update
    userSocket.UserPlayer.Wave ++;
    UpdateUserPlayerCtrl(userSocket);
    
    var message = new Message();
    message.MessageCode = MessageCode.TDWave_BattleWin;
    SendMessageToSocket(message, userSocket.Socket);
}

export function ProtectedFailCtrl(message : Message, userSocket : UserSocket) {
    LogUserSocket(LogCode.TDWave_ProtectedFail, userSocket, "", LogType.Normal);
    var message = new Message();
    message.MessageCode = MessageCode.TDWave_BattleLose;
    SendMessageToSocket(message, userSocket.Socket);
}

class TDWaveController {
    async ProtectedSuccessCtrl(message : Message, transferData : TransferData) {
        var userPlayer = await userPlayerController.GetUserPlayerCached(transferData.Token);
        if(userPlayer == null || userPlayer == undefined){
            var message = new Message();
            message.MessageCode = MessageCode.UserPlayerServer_Disconnect;
            transferData.Send(JSON.stringify(message));
            return;
        }
        //Reward
        logController.LogMessage(LogCode.TDWave_ProtectedSuccess, "", transferData.Token);
        if(userPlayer.Wave == undefined || userPlayer.Wave == null){
            userPlayer.Wave = 0;
        }
        var reward;
        if(userPlayer.Wave % 5 == 0){
            reward = {
                Money : TDWaveRewardLv.Money + TDWaveRewardGrowLv.Money * userPlayer.Wave,
                Food : TDWaveRewardLv.Food + TDWaveRewardGrowLv.Food * userPlayer.Wave,
                HeroScroll_White : 0,
                BlueprintHeroEquip_White : 0,
            }
        }else{
            reward = {
                Money : TDWaveReward5Lv.Money + TDWaveRewardGrow5Lv.Money * userPlayer.Wave,
                Food : TDWaveReward5Lv.Food + TDWaveRewardGrow5Lv.Food * userPlayer.Wave,
                HeroScroll_White : Math.floor(TDWaveReward5Lv.HeroScroll_White + TDWaveRewardGrow5Lv.HeroScroll_White * userPlayer.Wave),
                BlueprintHeroEquip_White : Math.floor(TDWaveReward5Lv.BlueprintHeroEquip_White + TDWaveRewardGrow5Lv.BlueprintHeroEquip_White * userPlayer.Wave)
            }
        }
        //Update
        if(await currencyController.AddCurrency(userPlayer._id, reward, transferData.Token)){
            
        }
        userSocket.UserPlayer.Wave ++;
        UpdateUserPlayerCtrl(userSocket);
        
        var message = new Message();
        message.MessageCode = MessageCode.TDWave_BattleWin;
        SendMessageToSocket(message, userSocket.Socket);
    }

    ProtectedFailCtrl(message : Message, transferData : TransferData) {
        logController.LogMessage(LogCode.TDWave_ProtectedFail, "", transferData.Token);
        var message = new Message();
        message.MessageCode = MessageCode.TDWave_BattleLose;
        transferData.Send(JSON.stringify(message));
    }
}

export const tdWaveController = new TDWaveController();