
import { Types } from "mongoose";
import { Hero, HeroModel} from "../../HeroServer/Model/Hero";
import { HeroCode } from "../../HeroServer/Model/HeroCode";
import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { SendMessageToSocket } from "../../MessageServer/Service/MessageService";
import { IUserSocket, UserSocket } from "../../UserSocket/Model/UserSocket";
import { CraftHeroEquip, CreateHeroEquip, FindHeroEquipById, FindHeroEquipByIdUserPlayer, HeroEquip, HeroEquipData, HeroEquipModel, HeroEquipUpgradeLv, HeroEquips, HeroWearEquip, IHeroEquip, UpdateHeroEquip } from "../Model/HeroEquip";
import { HeroEquipType } from "../Model/HeroEquipType";
import { IndexHeroEquipCraft, RateCraft } from "../Model/HeroEquipConfig";
import { heroEquipDataDictionary } from "../Service/HeroEquipService";
import { LogUserSocket, logController } from "../../LogServer/Controller/LogController";
import { LogCode } from "../../LogServer/Model/LogCode";
import { LogType } from "../../LogServer/Model/LogModel";
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

export async function WearingEquip(message: Message, userSocket: IUserSocket) {
    var heroWearEquip = HeroWearEquip.Parse(message.Data);
    var hero = userSocket.Hero[heroWearEquip.IdHero.toString()]
    if (hero == null || hero == undefined || hero.Code == HeroCode.Unknown) {
        WearingEquipFail(userSocket);
        return;
    }
    var heroEquip = userSocket.HeroEquip[heroWearEquip.IdHeroEquip.toString()]
    if (heroEquip == null || heroEquip == undefined || heroEquip.Code == HeroEquipCode.Unknown) {
        WearingEquipFail(userSocket);
        return;
    }
    var heroEquipData = heroEquipDataDictionary[heroEquip.Code];
    var heroEquip_Old;
    console.log("Dev 1691055136 Type: " + heroEquipData.HeroEquipType)
    if (heroEquipData.HeroEquipType === HeroEquipType.Weapon) {
        if (hero.IdWeapon != undefined && hero.IdWeapon != null)
            heroEquip_Old = userSocket.HeroEquip[hero.IdWeapon.toString()];
        hero.IdWeapon = heroEquip._id;
        heroEquip.IdHero = hero._id;
        console.log("Dev 1691055136 IdWeapon")
    }
    if (heroEquipData.HeroEquipType === HeroEquipType.Armor) {
        if (hero.IdArmor != undefined && hero.IdArmor != null)
            heroEquip_Old = userSocket.HeroEquip[hero.IdArmor.toString()];
        hero.IdArmor = heroEquip._id;
        heroEquip.IdHero = hero._id;
        console.log("Dev 1691055137 IdArmor")
    }
    if (heroEquipData.HeroEquipType === HeroEquipType.Helmet) {
        if (hero.IdHelmet != undefined && hero.IdHelmet != null)
            heroEquip_Old = userSocket.HeroEquip[hero.IdHelmet.toString()];
        hero.IdHelmet = heroEquip._id;
        heroEquip.IdHero = hero._id;
        console.log("Dev 1691055138 IdHelmet")
    }

    if (heroEquip_Old != null && heroEquip_Old != undefined) {
        delete heroEquip["IdHero"];
        RemoveHeroFromHeroEquip(heroEquip_Old, userSocket);
    }
    console.log("Dev 1691055132 hero:", hero)
    console.log("Dev 1691055133 heroEquip:", heroEquip)
    console.log("Dev 1691055134 heroEquipData:", heroEquipData)
    console.log("Dev 1691055135 heroEquip_Old:", heroEquip_Old)
    AddHeroToHeroEquip(heroEquip, userSocket);
    AddHeroEquipToHero(hero, userSocket);
}

export async function UnwearingEquip(message: Message, userSocket: IUserSocket) {
    var heroWearEquip = HeroWearEquip.Parse(message.Data);
    var hero = userSocket.Hero[heroWearEquip.IdHero.toString()]
    if (hero == null || hero == undefined || hero.Code == HeroCode.Unknown) {
        UnwearingEquipFail(userSocket);
    } else {
        if (hero.IdWeapon != undefined && hero.IdWeapon != null && hero.IdWeapon == heroWearEquip.IdHeroEquip) {
            delete hero.IdWeapon;
        }
        if (hero.IdArmor != undefined && hero.IdArmor != null && hero.IdArmor == heroWearEquip.IdHeroEquip) {
            delete hero.IdArmor;
        }
        if (hero.IdHelmet != undefined && hero.IdHelmet != null && hero.IdHelmet == heroWearEquip.IdHeroEquip) {
            delete hero.IdHelmet;
        }
        RemoveHeroEquipFromHero(hero, userSocket);
    }
    var heroEquip = userSocket.HeroEquip[heroWearEquip.IdHeroEquip.toString()]
    if (heroEquip == null || heroEquip == undefined || heroEquip.Code == HeroEquipCode.Unknown) {
        UnwearingEquipFail(userSocket);
    } else {
        delete heroEquip.IdHero;
        RemoveHeroFromHeroEquip(heroEquip, userSocket);
    }
}

export async function RemoveHeroFromHeroEquip(heroEquip: HeroEquip, userSocket: UserSocket) {
    HeroEquipModel.updateOne(
        {
            _id: heroEquip._id,
        },
        {
            $unset: { IdHero: 1 }
        }
    ).then(() => {
        UpdateHeroEquipToClient(heroEquip, userSocket);
    }).catch((err) => {
        LogUserSocket(LogCode.HeroEquip_UnequipFail, userSocket, err, LogType.Error);
    })
}

export async function RemoveHeroEquipFromHero(hero: Hero, userSocket: UserSocket) {
    HeroModel.updateOne(
        {
            _id: hero._id
        },
        {
            $set: { Gear: hero },
        }
    ).then(() => {
        // UpdateHeroToClient(hero, userSocket);
    }).catch((err) => {
        LogUserSocket(LogCode.HeroEquip_EquipFail, userSocket, err, LogType.Error);
    })
}

export async function AddHeroToHeroEquip(heroEquip: HeroEquip, userSocket: UserSocket) {
    HeroEquipModel.updateOne(
        {
            _id: heroEquip._id
        },
        {
            $set: { IdHero: heroEquip.IdHero }
        }
    ).then(() => {
        UpdateHeroEquipToClient(heroEquip, userSocket);
    }).catch((err) => {
        LogUserSocket(LogCode.HeroEquip_EquipFail, userSocket, err, LogType.Error);
    })
}

export async function AddHeroEquipToHero(hero: Hero, userSocket: UserSocket) {
    HeroModel.updateOne(
        {
            _id: hero._id
        },
        {
            $set: { Gear: hero }
        }
    ).then(() => {
        // UpdateHeroToClient(hero, userSocket);
    }).catch((err) => {
        LogUserSocket(LogCode.HeroEquip_EquipFail, userSocket, err, LogType.Error);
    })
}

export function UpdateHeroEquipToClient(heroEquip: HeroEquip, userSocket: UserSocket) {
    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_UpdateEquip;
    message.Data = JSON.stringify(heroEquip);
    SendMessageToSocket(message, userSocket.Socket);
}


export function WearingEquipFail(userSocket: IUserSocket) {
    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_WearingFail;
    SendMessageToSocket(message, userSocket.Socket);
}

export function UnwearingEquipFail(userSocket: IUserSocket) {
    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_UnwearingFail;
    SendMessageToSocket(message, userSocket.Socket);
}

export function UpdateHeroEquips(heroEquips: HeroEquips, userSocket: IUserSocket) {
    heroEquips.Elements.forEach(element => {
        UpdateHeroEquip(element);
    })

    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_UpdateEquips;
    message.Data = JSON.stringify(heroEquips);
    SendMessageToSocket(message, userSocket.Socket)
}

export function HeroEquipUpgradeLvCtrl(message: Message, userSocket: IUserSocket) {
    var heroEquipUpgradeLv = HeroEquipUpgradeLv.Parse(message.Data);
    FindHeroEquipById(heroEquipUpgradeLv.IdEquip).then((res: HeroEquip) => {
        var heroEquipData = heroEquipDataDictionary[res.Code];
        var cost = CostUpgradeLv(res.Lv, heroEquipUpgradeLv.NumberLv, heroEquipData.CostUpgrade, heroEquipData.CostUpgradeRise);
        if (cost > userSocket.Currency.Money) {
            HeroEquipUpgradeLvFail(userSocket);
        } else {
            userSocket.Currency.Money -= cost;
            res.Lv += heroEquipUpgradeLv.NumberLv;
            var heroeEquips = new HeroEquips();
            heroeEquips.Elements.push(res);
            UpdateHeroEquips(heroeEquips, userSocket);
            // UpdateCurrencyCtrl(userSocket);
        }
    })

}

export function HeroEquipUpgradeLvFail(userSocket: IUserSocket) {
    var message = new Message();
    message.MessageCode = MessageCode.HeroEquip_UpgradeLvFail;
    SendMessageToSocket(message, userSocket.Socket);
}

class HeroEquipController {
    async Login(message: Message, transferData: TransferData) {
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

async function HeroEquipLvUp(heroEquipID, lv) {
    var heroEquip;
    await HeroEquipModel.updateOne(
        {
            _id: heroEquipID
        },
        {
            $inc: { Lv: lv }
        }
    ).then(async res=>{
        if (res.modifiedCount == 0) {
            logController.LogError(LogCode.HeroEquip_NotFoundInDB, heroEquipID, "Server");
            heroEquip = null;
            return heroEquip;
        } else {
            heroEquip = await FindById(heroEquipID);
            return heroEquip;
        }
    })
    return heroEquip;
}

async function FindById(idHeroEquip){
    var heroEquip;
    await HeroEquipModel.findOne({_id : idHeroEquip})
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