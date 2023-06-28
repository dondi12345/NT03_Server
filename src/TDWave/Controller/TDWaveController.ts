import { UpdateCurrencyCtrl } from "../../Currency/Controller/CurrencyController";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { ChangeRes } from "../../Res/Controller/ResController";
import { ResCode } from "../../Res/Model/ResCode";
import { UpdateUserPlayerCtrl } from "../../UserPlayerServer/Controller/UserPlayerController";
import { UserSocket } from "../../UserSocket/Model/UserSocket";
import { TDWaveReward5Lv, TDWaveRewardGrow5Lv, TDWaveRewardGrowLv, TDWaveRewardLv } from "./TDWaveData";

export function ProtectedSuccessCtrl(message : Message, userSocket : UserSocket) {
    //Reward
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
    var message = new Message();
    message.MessageCode = MessageCode.TDWave_BattleLose;
    SendMessageToSocket(message, userSocket.Socket);
}