import { Types } from "mongoose";
import { logController } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { HeroTeam, HeroTeamModel, SelectHero} from "../Model/HeroTeam";
import { TransferData } from "../../TransferData";
import { tokenController } from "../../Token/Controller/TockenController";
import { DataModel } from "../../Utils/DataModel";
import { redisControler } from "../../Service/Database/RedisConnect";
import { RedisKeyConfig } from "../../Enviroment/Env";
import { heroController } from "../../HeroServer/Controller/HeroController";

class HeroTeamCtrl{
    async Login(message : Message, transferData: TransferData){
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

    async SelectHero(message : Message, transferData : TransferData){
        var tokenUserPlayer = tokenController.AuthenTokenUserPlayer(transferData.Token);
        if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
            transferData.Send(LoginFailMessage())
            return LoginFailMessage();
        }
        var selectHero = DataModel.Parse<SelectHero>(message.Data);
        var heroTeam = await this.GetHeroTeamCached(tokenUserPlayer.IdUserPlayer);
        if(heroTeam == null || heroTeam == undefined){
            transferData.Send(LoginFailMessage())
            return LoginFailMessage();
        }
        var hero = await heroController.GetHeroCached(tokenUserPlayer.IdUserPlayer, selectHero.IdHero);
        if(hero == null || hero == undefined){
            transferData.Send(LoginFailMessage())
            return LoginFailMessage();
        }
        switch (selectHero.IdHero) {
            case heroTeam.Slot1:
                transferData.Send(LoginFailMessage())
                return LoginFailMessage();
            case heroTeam.Slot2:
                transferData.Send(LoginFailMessage())
                return LoginFailMessage();
            case heroTeam.Slot3:
                transferData.Send(LoginFailMessage())
                return LoginFailMessage();
            case heroTeam.Slot4:
                transferData.Send(LoginFailMessage())
                return LoginFailMessage();
            case heroTeam.Slot5:
                transferData.Send(LoginFailMessage())
                return LoginFailMessage();
        }
        if(selectHero.IndexSlot == 1){
            heroTeam.Slot1 = selectHero.IdHero;
        }
        if(selectHero.IndexSlot == 2){
            heroTeam.Slot2 = selectHero.IdHero;
        }
        if(selectHero.IndexSlot == 3){
            heroTeam.Slot3 = selectHero.IdHero;
        }
        if(selectHero.IndexSlot == 4){
            heroTeam.Slot4 = selectHero.IdHero;
        }
        if(selectHero.IndexSlot == 5){
            heroTeam.Slot5 = selectHero.IdHero;
        }

        heroTeam = await UpdateHeroTeam(heroTeam);
        var message = new Message();
        message.MessageCode = MessageCode.HeroTeam_Update;
        message.Data = JSON.stringify(heroTeam);
        transferData.Send(JSON.stringify(message))
    }

    async DeselectHero(message : Message, transferData : TransferData){
        var tokenUserPlayer = tokenController.AuthenTokenUserPlayer(transferData.Token);
        if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
            transferData.Send(LoginFailMessage())
            return LoginFailMessage();
        }
        var selectHero = DataModel.Parse<SelectHero>(message.Data);
        var heroTeam = await this.GetHeroTeamCached(tokenUserPlayer.IdUserPlayer);
        if(heroTeam == null || heroTeam == undefined){
            transferData.Send(LoginFailMessage())
            return LoginFailMessage();
        }
        if(selectHero.IndexSlot == 1){
            heroTeam.Slot1 = "";
        }
        if(selectHero.IndexSlot == 2){
            heroTeam.Slot2 = "";
        }
        if(selectHero.IndexSlot == 3){
            heroTeam.Slot3 = "";
        }
        if(selectHero.IndexSlot == 4){
            heroTeam.Slot4 = "";
        }
        if(selectHero.IndexSlot == 5){
            heroTeam.Slot5 = "";
        }

        heroTeam = await UpdateHeroTeam(heroTeam);
        var message = new Message();
        message.MessageCode = MessageCode.HeroTeam_Update;
        message.Data = JSON.stringify(heroTeam);
        transferData.Send(JSON.stringify(message))
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

function LoginFailMessage(){
    var message = new Message();
    message.MessageCode = MessageCode.HeroTeam_LoginFail;
    return message;
}

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

async function UpdateHeroTeam(heroTeamIncome : HeroTeam) {
    var heroTeam
    await HeroTeamModel.updateOne(
        {
            _id : heroTeamIncome._id
        },
        {
            Slot1 : heroTeamIncome.Slot1,
            Slot2 : heroTeamIncome.Slot2,
            Slot3 : heroTeamIncome.Slot3,
            Slot4 : heroTeamIncome.Slot4,
            Slot5 : heroTeamIncome.Slot5,
        }
    ).then(async res=>{
        if (res.modifiedCount == 0 && res.matchedCount == 0) {
            logController.LogError(LogCode.HeroTeam_NotFoundInDB, heroTeamIncome._id, "Server");
            heroTeam = null;
            return heroTeam;
        } else {
            heroTeam = await FindByIdUserPlayer(heroTeamIncome.IdUserPlayer.toString());
            heroTeamCtrl.SetHeroTeamCached(heroTeam);
            return heroTeam;
        }
    })
    return heroTeam;
}