
import { Types } from "mongoose";
import { HeroCode } from "../../HeroServer/Model/HeroCode";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { CraftHeroEquip, HeroEquip, HeroEquipData, HeroEquipModel, HeroEquipUpgradeLv, HeroWearEquip} from "../Model/HeroEquip";
import { HeroEquipType } from "../Model/HeroEquipType";
import { IndexHeroEquipCraft, RateCraft } from "../Model/HeroEquipConfig";
import { logController } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { HeroEquipCode } from "../Model/HeroEquipCode";
import { TransferData } from "../../TransferData";
import { tokenController } from "../../Token/Controller/TockenController";
import { NTArray } from "../../Utils/Other";
import { DataModel } from "../../Utils/DataModel";
import { redisControler } from "../../Service/Database/RedisConnect";
import { RedisKeyConfig } from "../../Enviroment/Env";
import { currencyController } from "../../Currency/Controller/CurrencyController";
import { ItemData } from "../../Item/Model/ItemData";
import { dataCenterName } from "../../DataCenter/Model/DataVersion";
import { ItemCode } from "../../Item/Model/ItemCode";
import { dataCenterController } from "../../DataCenter/Controller/DataCenterController";
import { heroController } from "../../HeroServer/Controller/HeroController";

class HeroEquipController {
    async Login(message: Message, transferData: TransferData) {
        logController.LogDev("Dev 1692090212 Heroequip login ")
        var tokenUserPlayer = tokenController.AuthenTokenUserPlayer(transferData.Token);
        if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
            logController.LogWarring(LogCode.HeroEquip_LoginFail, "Authen fail", transferData.Token);
            return LoginFail(transferData);
        }
        var heroEquips = await FindHeroEquipsByIdUserPlayer(tokenUserPlayer.IdUserPlayer);
        logController.LogDev("Dev 1692090211 Heroequip: " + heroEquips.Elements.length)
        logController.LogMessage(LogCode.HeroEquip_LoginSuccess, "", transferData.Token)
        var message = new Message();
        message.MessageCode = MessageCode.HeroEquip_LoginSuccess;
        message.Data = JSON.stringify(heroEquips);

        transferData.Send(JSON.stringify(message))
    }

    async CraftEquip(message: Message, transferData: TransferData) {
        var tokenUserPlayer = tokenController.AuthenTokenUserPlayer(transferData.Token);
        if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
            logController.LogWarring(LogCode.HeroEquip_LoginFail, "Authen fail", transferData.Token);
            transferData.Send(JSON.stringify(CraftFail()));
            return CraftFail()
        }
        var craftHeroEquip = DataModel.Parse<CraftHeroEquip>(message.Data);

        var currency = await currencyController.GetCurrencyCached(tokenUserPlayer.IdUserPlayer);
        if (currency == null || currency == undefined) {
            transferData.Send(JSON.stringify(CraftFail()));
            return CraftFail()
        }
        if (currency.BlueprintHeroEquip_White < 1) {
            logController.LogWarring(LogCode.HeroEquip_NotEnoughForCraft, "BlueprintHeroEquip_White", transferData.Token);
            transferData.Send(JSON.stringify(CraftFail()));
            return CraftFail()
        }

        currency = await currencyController.AddCurrency({ BlueprintHeroEquip_White: -1 }, transferData.Token);
        if (currency == null || currency == undefined) {
            transferData.Send(JSON.stringify(CraftFail()));
            return CraftFail()
        }

        var messageUdCurrency = new Message();
        messageUdCurrency.MessageCode = MessageCode.Currency_Update;
        messageUdCurrency.Data = JSON.stringify(currency);

        var heroEquip = await CreateRandomHeroEquip_White(tokenUserPlayer.IdUserPlayer);
        if (heroEquip == null || heroEquip == undefined) {
            transferData.Send(JSON.stringify(messageUdCurrency), JSON.stringify(CraftFail()));
            return CraftFail()
        }

        var messageCraftSuc = new Message();
        messageCraftSuc.MessageCode = MessageCode.HeroEquip_CraftSuccess;
        messageCraftSuc.Data = JSON.stringify(heroEquip);

        transferData.Send(JSON.stringify(messageUdCurrency), JSON.stringify(messageCraftSuc))
    }

    async UpgradeLv(message: Message, transferData: TransferData) {
        var tokenUserPlayer = tokenController.AuthenTokenUserPlayer(transferData.Token);
        if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
            logController.LogWarring(LogCode.HeroEquip_LoginFail, "Authen fail", transferData.Token);
            transferData.Send(JSON.stringify(UpgradelvFail()));
            return UpgradelvFail()
        }
        var heroEquipUpgradeLv = HeroEquipUpgradeLv.Parse(message.Data);

        var heroEquip = await this.GetHeroEquipCached(tokenUserPlayer.IdUserPlayer, heroEquipUpgradeLv.IdEquip.toString());
        logController.LogDev("1692160771 ", heroEquip);
        if (heroEquip == null || heroEquip == undefined) {
            transferData.Send(JSON.stringify(UpgradelvFail()));
            return UpgradelvFail()
        }
        var currency = await currencyController.GetCurrencyCached(tokenUserPlayer.IdUserPlayer);
        if (currency == null || currency == undefined) {
            transferData.Send(JSON.stringify(UpgradelvFail()));
            return UpgradelvFail()
        }
        var heroEquipData = DataModel.Parse<HeroEquipData>(await dataCenterController.GetDataElementCached(dataCenterName.DataHeroEquip, heroEquip.Code.toString()));
        if (heroEquipData == null || heroEquipData == undefined) {
            transferData.Send(JSON.stringify(UpgradelvFail()));
            return UpgradelvFail()
        }
        logController.LogDev("1692172832 ", heroEquipData);
        var cost = CostUpgradeLv(heroEquip.Lv, heroEquipUpgradeLv.NumberLv, heroEquipData.CostUpgrade, heroEquipData.CostUpgradeRise);
        if (cost > currency.Money) {
            transferData.Send(JSON.stringify(UpgradelvFail()));
            return UpgradelvFail()
        }
        logController.LogDev("1692172830 "+cost)
        currency = await currencyController.AddCurrency({ Money: -cost }, transferData.Token);
        if (currency == null || currency == undefined) {
            transferData.Send(JSON.stringify(UpgradelvFail()));
            return UpgradelvFail()
        }
        heroEquip = await HeroEquipLvUp(heroEquipUpgradeLv.IdEquip, heroEquipUpgradeLv.NumberLv)
        if(heroEquip == null || heroEquip ==undefined){
            transferData.Send(JSON.stringify(UpgradelvFail()));
            return UpgradelvFail()
        }

        var messageLvUp = new Message()
        messageLvUp.MessageCode = MessageCode.HeroEquip_UpgradeLvSuc;
        messageLvUp.Data = JSON.stringify(heroEquip);

        var messageUdCurrency = new Message();
        messageUdCurrency.MessageCode = MessageCode.Currency_Update;
        messageUdCurrency.Data = JSON.stringify(currency);

        transferData.Send(JSON.stringify(messageLvUp), JSON.stringify(messageUdCurrency));
    }

    async WearingEquip(message: Message, transferData: TransferData){
        var tokenUserPlayer = tokenController.AuthenTokenUserPlayer(transferData.Token);
        if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
            logController.LogWarring(LogCode.HeroEquip_LoginFail, "Authen fail", transferData.Token);
            transferData.Send(JSON.stringify(WearFail()));
            return WearFail()
        }
        var heroWearEquip = DataModel.Parse<HeroWearEquip>(message.Data);
        var hero = await heroController.GetHeroCached(tokenUserPlayer.IdUserPlayer, heroWearEquip.IdHero.toString());
        if (hero == null || hero == undefined || hero.Code == HeroCode.Unknown) {
            transferData.Send(JSON.stringify(WearFail()));
            return WearFail();
        }
        var heroEquip = await this.GetHeroEquipCached(tokenUserPlayer.IdUserPlayer, heroWearEquip.IdHeroEquip.toString());
        if (heroEquip == null || heroEquip == undefined || heroEquip.Code == HeroEquipCode.Unknown) {
            transferData.Send(JSON.stringify(WearFail()));
            return WearFail();
        }
        var heroEquipData = DataModel.Parse<HeroEquipData>(await dataCenterController.GetDataElementCached(dataCenterName.DataHeroEquip, heroEquip.Code.toString()));
        var idHeroEquip_Old = "";

        logController.LogDev("Dev 1691055135 Type: " + heroEquipData.HeroEquipType)
        if (heroEquipData.HeroEquipType === HeroEquipType.Weapon) {
            if (hero.HeroGear.IdWeapon != undefined && hero.HeroGear.IdWeapon != null)
                idHeroEquip_Old = hero.HeroGear.IdWeapon;
            hero.HeroGear.IdWeapon = heroEquip._id;
            heroEquip.IdHero = hero._id;
            logController.LogDev("Dev 1691055136 IdWeapon")
        }
        if (heroEquipData.HeroEquipType === HeroEquipType.Armor) {
            if (hero.HeroGear.IdArmor != undefined && hero.HeroGear.IdArmor != null)
                idHeroEquip_Old = hero.HeroGear.IdArmor;
            hero.HeroGear.IdArmor = heroEquip._id;
            heroEquip.IdHero = hero._id;
            logController.LogDev("Dev 1691055137 IdArmor")
        }
        if (heroEquipData.HeroEquipType === HeroEquipType.Helmet) {
            if (hero.HeroGear.IdHelmet != undefined && hero.HeroGear.IdHelmet != null)
                idHeroEquip_Old = hero.HeroGear.IdHelmet;
            hero.HeroGear.IdHelmet = heroEquip._id;
            heroEquip.IdHero = hero._id;
            logController.LogDev("Dev 1691055138 IdHelmet")
        }
        if(idHeroEquip_Old == heroEquip._id){
            transferData.Send(JSON.stringify(WearFail()));
            return WearFail();
        }

        logController.LogDev("1692266425", hero, heroEquip);

        var messageOldEquip = new Message();
        if (idHeroEquip_Old != null && idHeroEquip_Old != undefined && idHeroEquip_Old.length > 0) {
            var heroEquip_Old = await UpdateHeroInHeroEquip(new Types.ObjectId(idHeroEquip_Old), "");
            if(heroEquip_Old == null || heroEquip_Old == undefined){
                transferData.Send(JSON.stringify(WearFail()));
                return WearFail();
            }else{
                messageOldEquip.MessageCode = MessageCode.HeroEquip_UpdateEquip;
                messageOldEquip.Data = JSON.stringify(heroEquip_Old);
            }
        }
        
        heroEquip = await UpdateHeroInHeroEquip(heroEquip._id, heroEquip.IdHero);
        if(heroEquip == null || heroEquip == undefined){
            transferData.Send(JSON.stringify(WearFail()));
            return WearFail();
        }

        hero = await heroController.UpdateGear(hero._id, hero.HeroGear);
        if(hero == null || hero == undefined){
            heroEquip = await UpdateHeroInHeroEquip(heroEquip._id, "");
            transferData.Send(JSON.stringify(WearFail()));
            return WearFail();
        }
        logController.LogDev("1692266426", hero, heroEquip);
        var messageUdEquip = new Message();
        messageUdEquip.MessageCode = MessageCode.HeroEquip_WearingSuccess;
        messageUdEquip.Data = JSON.stringify(heroEquip);

        var messageWearSuc = new Message();
        messageWearSuc.MessageCode = MessageCode.Hero_UpdateHero;
        messageWearSuc.Data = JSON.stringify(hero);

        transferData.Send(messageOldEquip, messageUdEquip, messageWearSuc);
        
    }

    async UnWearingEquip(message: Message, transferData: TransferData){
        var tokenUserPlayer = tokenController.AuthenTokenUserPlayer(transferData.Token);
        if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
            logController.LogWarring(LogCode.HeroEquip_LoginFail, "Authen fail", transferData.Token);
            transferData.Send(JSON.stringify(UnWearFail()));
            return UnWearFail()
        }
        var heroWearEquip = DataModel.Parse<HeroWearEquip>(message.Data);
        var hero = await heroController.GetHeroCached(tokenUserPlayer.IdUserPlayer, heroWearEquip.IdHero.toString());
        if (hero == null || hero == undefined || hero.Code == HeroCode.Unknown) {
            transferData.Send(JSON.stringify(UnWearFail()));
            return UnWearFail();
        }
        var heroEquip = await this.GetHeroEquipCached(tokenUserPlayer.IdUserPlayer, heroWearEquip.IdHeroEquip.toString());
        if (heroEquip == null || heroEquip == undefined || heroEquip.Code == HeroEquipCode.Unknown) {
            transferData.Send(JSON.stringify(UnWearFail()));
            return UnWearFail();
        }
        var heroEquipData = DataModel.Parse<HeroEquipData>(await dataCenterController.GetDataElementCached(dataCenterName.DataHeroEquip, heroEquip.Code.toString()));
        switch (heroEquipData.HeroEquipType) {
            case HeroEquipType.Weapon:
                if(hero.HeroGear.IdWeapon.length == 0){
                    transferData.Send(JSON.stringify(UnWearFail()));
                    return UnWearFail();
                }
                hero.HeroGear.IdWeapon = "";
                break;
            case HeroEquipType.Armor:
                hero.HeroGear.IdArmor = "";
                if(hero.HeroGear.IdArmor.length == 0){
                    transferData.Send(JSON.stringify(UnWearFail()));
                    return UnWearFail();
                }
                break;
            case HeroEquipType.Helmet:
                if(hero.HeroGear.IdHelmet.length == 0){
                    transferData.Send(JSON.stringify(UnWearFail()));
                    return UnWearFail();
                }
                hero.HeroGear.IdHelmet = "";
                break;
        }
        heroEquip.IdHero = "";

        heroEquip = await UpdateHeroInHeroEquip(heroEquip._id, heroEquip.IdHero);
        if(heroEquip == null || heroEquip == undefined){
            transferData.Send(JSON.stringify(UnWearFail()));
            return UnWearFail();
        }

        hero = await heroController.UpdateGear(hero._id, hero.HeroGear);
        if(hero == null || hero == undefined){
            heroEquip = await UpdateHeroInHeroEquip(heroEquip._id, heroWearEquip.IdHero.toString());
            transferData.Send(JSON.stringify(UnWearFail()));
            return UnWearFail();
        }

        var messageUdEquip = new Message();
        messageUdEquip.MessageCode = MessageCode.HeroEquip_UnwearingSuccess;
        messageUdEquip.Data = JSON.stringify(heroEquip);

        var messageWearSuc = new Message();
        messageWearSuc.MessageCode = MessageCode.Hero_UpdateHero;
        messageWearSuc.Data = JSON.stringify(hero);

        transferData.Send(messageUdEquip, messageWearSuc);

    }

    async GetHeroEquipCached(userPlayerID: string, heroEquipID: string) {
        var heroEquipJson = await new Promise(async (reslove, rejects) => {
            reslove(await redisControler.Get(RedisKeyConfig.KeyHeroEquipData(userPlayerID, heroEquipID)))
        })
        if (heroEquipJson == null || heroEquipJson == undefined) {
            logController.LogError(LogCode.HeroEquip_NotFoundInCache, userPlayerID, "Server")
            return null;
        }
        return DataModel.Parse<HeroEquip>(heroEquipJson)
    }

    async SetHeroEquipCached(heroEquip: HeroEquip) {
        logController.LogDev("1692095951", heroEquip)
        redisControler.Set(RedisKeyConfig.KeyHeroEquipData(heroEquip.IdUserPlayer.toString(), heroEquip._id.toString()), JSON.stringify(heroEquip));
    }
}

export const heroEquipController = new HeroEquipController();

function LoginFail(transferData: TransferData) {
    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_LoginFail;
    transferData.Send(JSON.stringify(message));
    return message;
}

async function FindHeroEquipsByIdUserPlayer(idUserPlayer: string) {
    var data;
    await HeroEquipModel.find({ IdUserPlayer: idUserPlayer }).then((res) => {
        data = res;
        logController.LogDev("1692085245 Dev ", res)
    }).catch(async err => {
        logController.LogError(LogCode.HeroEquip_NotFoundInDB, idUserPlayer + ":" + err, "Server");
    })
    if (data == null || data == undefined) {
        logController.LogWarring(LogCode.HeroEquip_Empty, idUserPlayer, "Server");
        data = []
    }
    var heroEquips = new NTArray<HeroEquip>();
    for (let item of data) {
        var heroEquip = DataModel.Parse<HeroEquip>(item);
        heroEquips.Elements.push(heroEquip);
        heroEquipController.SetHeroEquipCached(heroEquip)
    }
    return heroEquips;
}

function CraftFail() {
    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_CraftFail;
    return message;
}

function WearFail() {
    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_WearingFail;
    return message;
}
function UnWearFail() {
    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_UnwearingFail;
    return message;
}

async function CreateRandomHeroEquip_White(userPlayerID: string) {
    var maxRate = RateCraft["BlueprintHeroEquip_White"];
    var totalRate = 0;
    var itemData = DataModel.Parse<ItemData>(await dataCenterController.GetDataElementCached(dataCenterName.DataItem, ItemCode["BlueprintHeroEquip_White"].toString()));
    if (itemData == null) return null;

    totalRate += itemData.CraftHeroEquip;
    var rand = Math.random() * maxRate;
    logController.LogDev("1692095948 " + rand + " - " + totalRate + " - " + maxRate)
    if (rand > totalRate) return null;
    var code = IndexHeroEquipCraft["BlueprintHeroEquip_White"][Math.floor(Math.random() * IndexHeroEquipCraft["BlueprintHeroEquip_White"].length)];
    logController.LogDev("1692095949 " + code)
    var heroEquipData = DataModel.Parse<HeroEquipData>(await dataCenterController.GetDataElementCached(dataCenterName.DataHeroEquip, code.toString()));
    var heroEquip = HeroEquip.New(code, new Types.ObjectId(userPlayerID), heroEquipData.HeroEquipType);
    var newHE = await AddHeroEquip(heroEquip);
    if (newHE == null || newHE == undefined) return null;
    return heroEquip;
}

async function AddHeroEquip(heroEquip: HeroEquip) {
    var data
    await HeroEquipModel.create(heroEquip).then(res => {
        data = res;
        logController.LogDev("1692095950", res)
        heroEquipController.SetHeroEquipCached(res)
    }).catch(err => {
        logController.LogError(LogCode.HeroEquip_CreateNewFail, err, "Server")
        data = null;
    })
    return data;
}

function UpgradelvFail() {
    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_UpgradeLvFail;
    return message;
}

function CostUpgradeLv(lv: number, lvRise: number, start: number, raise: number) {
    var result = 0;
    logController.LogDev()
    for (let i = lv; i < lv + lvRise; i++) {
        result += start + raise * i * (i + 1);
    }
    return result;
}

async function FindById(idHeroEquip){
    var heroEquip;
    await HeroEquipModel.findById(idHeroEquip)
    .then(res=>{
        if(res == null || res == undefined) throw null; 
        heroEquip = DataModel.Parse<HeroEquip>(res);
        logController.LogDev("1692172948 ", res)
        heroEquipController.SetHeroEquipCached(heroEquip);
        return heroEquip;
    })
    .catch(err=>{
        logController.LogError(LogCode.HeroEquip_NotFoundInDB,idHeroEquip, "Server");
        heroEquip = null;
        return heroEquip;
    })
    return heroEquip;
}

async function HeroEquipLvUp(heroEquipID, lv) {
    var heroEquip;
    await HeroEquipModel.updateOne(
        {
            _id : heroEquipID
        },
        {
            $inc: { Lv: lv }
        }
    ).then(async res=>{
        logController.LogDev("1691055268: ", res)
        if (res.modifiedCount == 0 && res.matchedCount == 0) {
            logController.LogError(LogCode.HeroEquip_NotFoundInDB, heroEquipID, "Server");
            heroEquip = null;
            return heroEquip;;
        } else {
            heroEquip = await FindById(heroEquipID);
            heroEquipController.SetHeroEquipCached(heroEquip);
            return heroEquip;
        }
    })
    return heroEquip;
}
async function UpdateHeroInHeroEquip(heroEquipID, heroID: string) {
    var heroEquip;
    logController.LogDev("1691055254: ", heroEquipID)
    await HeroEquipModel.findOne(
        {
            _id : heroEquipID
        }
    ).then(res=>{
        logController.LogDev("1692269432 ", res)
    })
    await HeroEquipModel.updateOne(
        {
            _id : heroEquipID
        },
        {
            IdHero : heroID
        }
    ).then(async res=>{
        logController.LogDev("1692269431 ", res)
        if (res.modifiedCount == 0 && res.matchedCount == 0) {
            logController.LogError(LogCode.HeroEquip_NotFoundInDB, heroEquipID, "Server");
            heroEquip = null;
            return heroEquip;
        } else {
            heroEquip = await FindById(heroEquipID);
            heroEquipController.SetHeroEquipCached(heroEquip);
            return heroEquip;
        }
    }).catch(err=>{
        logController.LogError(LogCode.HeroEquip_SaveFail,heroEquipID+": "+ err, "Server")
    })
    return heroEquip;
}