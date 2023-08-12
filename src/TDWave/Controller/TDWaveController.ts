import { currencyController } from "../../Currency/Controller/CurrencyController";
import { LogUserSocket, logController } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { TransferData } from "../../TransferData";
import { userPlayerController } from "../../UserPlayerServer/Controller/UserPlayerController";
import { TDWaveReward5Lv, TDWaveRewardGrow5Lv, TDWaveRewardGrowLv, TDWaveRewardLv } from "./TDWaveData";

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
        logController.LogDev("12355334 Dev: " ,userPlayer)
        if(userPlayer.Wave == undefined || userPlayer.Wave == null){
            userPlayer.Wave = 0;
        }
        var reward;
        if(userPlayer.Wave % 5 == 0){
            reward = {
                Money : TDWaveReward5Lv.Money + TDWaveRewardGrow5Lv.Money * userPlayer.Wave,
                Food : TDWaveReward5Lv.Food + TDWaveRewardGrow5Lv.Food * userPlayer.Wave,
                HeroScroll_White : Math.floor(TDWaveReward5Lv.HeroScroll_White + TDWaveRewardGrow5Lv.HeroScroll_White * userPlayer.Wave),
                BlueprintHeroEquip_White : Math.floor(TDWaveReward5Lv.BlueprintHeroEquip_White + TDWaveRewardGrow5Lv.BlueprintHeroEquip_White * userPlayer.Wave)
            }
        }else{
            reward = {
                Money : TDWaveRewardLv.Money + TDWaveRewardGrowLv.Money * userPlayer.Wave,
                Food : TDWaveRewardLv.Food + TDWaveRewardGrowLv.Food * userPlayer.Wave,
                HeroScroll_White : 0,
                BlueprintHeroEquip_White : 0,
            }
        }
        //Update
        console.log(userPlayer, reward, userPlayer.Wave % 5 == 0)
        userPlayer = await userPlayerController.UserPlayerChangeAdd({Wave : 1}, transferData.Token)
        var currency = await currencyController.AddCurrency(reward, transferData.Token)
        if(currency == null || currency == undefined){
            tdWaveController.ProtectedFailCtrl(new Message(), transferData);
            return;
        }
        
        var messageUpdateUserPlayer = new Message();
        messageUpdateUserPlayer.MessageCode = MessageCode.UserPlayerServer_Update;
        messageUpdateUserPlayer.Data = JSON.stringify(userPlayer);

        var messageCurrency = new Message();
        messageCurrency.MessageCode = MessageCode.Currency_Update;
        messageCurrency.Data = JSON.stringify(currency);
        
        var message = new Message();
        message.MessageCode = MessageCode.TDWave_BattleWin;
        message.Data = JSON.stringify(reward);

        transferData.Send(JSON.stringify(messageUpdateUserPlayer), JSON.stringify(messageCurrency), JSON.stringify(message))
    }

    ProtectedFailCtrl(message : Message, transferData : TransferData) {
        logController.LogMessage(LogCode.TDWave_ProtectedFail, "", transferData.Token);
        var message = new Message();
        message.MessageCode = MessageCode.TDWave_BattleLose;
        transferData.Send(JSON.stringify(message));
    }
}

export const tdWaveController = new TDWaveController();