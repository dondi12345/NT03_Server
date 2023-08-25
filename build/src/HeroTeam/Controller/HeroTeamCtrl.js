"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.heroTeamCtrl = void 0;
const mongoose_1 = require("mongoose");
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const HeroTeam_1 = require("../Model/HeroTeam");
const TockenController_1 = require("../../Token/Controller/TockenController");
const DataModel_1 = require("../../Utils/DataModel");
const RedisConnect_1 = require("../../Service/Database/RedisConnect");
const Env_1 = require("../../Enviroment/Env");
const HeroController_1 = require("../../HeroServer/Controller/HeroController");
class HeroTeamCtrl {
    Login(message, transferData) {
        var message;
        return __awaiter(this, void 0, void 0, function* () {
            var tokenUserPlayer = TockenController_1.tokenController.AuthenTokenUserPlayer(transferData.Token);
            if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
                transferData.Send(LoginFailMessage());
                return LoginFailMessage();
            }
            var heroTeam = yield FindByIdUserPlayer(tokenUserPlayer.IdUserPlayer);
            message = new Message_1.Message();
            message.MessageCode = MessageCode_1.MessageCode.HeroTeam_LoginSuccess;
            message.Data = JSON.stringify(heroTeam);
            transferData.Send(JSON.stringify(message));
        });
    }
    SelectHero(message, transferData) {
        var message;
        return __awaiter(this, void 0, void 0, function* () {
            var tokenUserPlayer = TockenController_1.tokenController.AuthenTokenUserPlayer(transferData.Token);
            if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
                transferData.Send(LoginFailMessage());
                return LoginFailMessage();
            }
            var selectHero = DataModel_1.DataModel.Parse(message.Data);
            var heroTeam = yield this.GetHeroTeamCached(tokenUserPlayer.IdUserPlayer);
            if (heroTeam == null || heroTeam == undefined) {
                transferData.Send(LoginFailMessage());
                return LoginFailMessage();
            }
            var hero = yield HeroController_1.heroController.GetHeroCached(tokenUserPlayer.IdUserPlayer, selectHero.IdHero);
            if (hero == null || hero == undefined) {
                transferData.Send(LoginFailMessage());
                return LoginFailMessage();
            }
            switch (selectHero.IdHero) {
                case heroTeam.Slot1:
                    transferData.Send(LoginFailMessage());
                    return LoginFailMessage();
                case heroTeam.Slot2:
                    transferData.Send(LoginFailMessage());
                    return LoginFailMessage();
                case heroTeam.Slot3:
                    transferData.Send(LoginFailMessage());
                    return LoginFailMessage();
                case heroTeam.Slot4:
                    transferData.Send(LoginFailMessage());
                    return LoginFailMessage();
                case heroTeam.Slot5:
                    transferData.Send(LoginFailMessage());
                    return LoginFailMessage();
            }
            if (selectHero.IndexSlot == 1) {
                heroTeam.Slot1 = selectHero.IdHero;
            }
            if (selectHero.IndexSlot == 2) {
                heroTeam.Slot2 = selectHero.IdHero;
            }
            if (selectHero.IndexSlot == 3) {
                heroTeam.Slot3 = selectHero.IdHero;
            }
            if (selectHero.IndexSlot == 4) {
                heroTeam.Slot4 = selectHero.IdHero;
            }
            if (selectHero.IndexSlot == 5) {
                heroTeam.Slot5 = selectHero.IdHero;
            }
            heroTeam = yield UpdateHeroTeam(heroTeam);
            message = new Message_1.Message();
            message.MessageCode = MessageCode_1.MessageCode.HeroTeam_Update;
            message.Data = JSON.stringify(heroTeam);
            transferData.Send(JSON.stringify(message));
        });
    }
    DeselectHero(message, transferData) {
        var message;
        return __awaiter(this, void 0, void 0, function* () {
            var tokenUserPlayer = TockenController_1.tokenController.AuthenTokenUserPlayer(transferData.Token);
            if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
                transferData.Send(LoginFailMessage());
                return LoginFailMessage();
            }
            var selectHero = DataModel_1.DataModel.Parse(message.Data);
            var heroTeam = yield this.GetHeroTeamCached(tokenUserPlayer.IdUserPlayer);
            if (heroTeam == null || heroTeam == undefined) {
                transferData.Send(LoginFailMessage());
                return LoginFailMessage();
            }
            if (selectHero.IndexSlot == 1) {
                heroTeam.Slot1 = "";
            }
            if (selectHero.IndexSlot == 2) {
                heroTeam.Slot2 = "";
            }
            if (selectHero.IndexSlot == 3) {
                heroTeam.Slot3 = "";
            }
            if (selectHero.IndexSlot == 4) {
                heroTeam.Slot4 = "";
            }
            if (selectHero.IndexSlot == 5) {
                heroTeam.Slot5 = "";
            }
            heroTeam = yield UpdateHeroTeam(heroTeam);
            message = new Message_1.Message();
            message.MessageCode = MessageCode_1.MessageCode.HeroTeam_Update;
            message.Data = JSON.stringify(heroTeam);
            transferData.Send(JSON.stringify(message));
        });
    }
    GetHeroTeamCached(userPlayerID) {
        return __awaiter(this, void 0, void 0, function* () {
            var heroTeamJson = yield new Promise((reslove, rejects) => __awaiter(this, void 0, void 0, function* () {
                reslove(yield RedisConnect_1.redisControler.Get(Env_1.RedisKeyConfig.KeyHeroTeamData(userPlayerID)));
            }));
            if (heroTeamJson == null || heroTeamJson == undefined) {
                LogController_1.logController.LogError(LogCode_1.LogCode.HeroTeam_NotFoundInCache, userPlayerID, "Server");
                return new HeroTeam_1.HeroTeam();
            }
            return DataModel_1.DataModel.Parse(heroTeamJson);
        });
    }
    SetHeroTeamCached(heroTeam) {
        return __awaiter(this, void 0, void 0, function* () {
            RedisConnect_1.redisControler.Set(Env_1.RedisKeyConfig.KeyHeroTeamData(heroTeam.IdUserPlayer), JSON.stringify(heroTeam));
        });
    }
}
exports.heroTeamCtrl = new HeroTeamCtrl();
function LoginFailMessage() {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.HeroTeam_LoginFail;
    return message;
}
function FindByIdUserPlayer(idUserPlayer) {
    return __awaiter(this, void 0, void 0, function* () {
        var data;
        yield HeroTeam_1.HeroTeamModel.findOne({ IdUserPlayer: idUserPlayer }).then((res) => {
            data = res;
            LogController_1.logController.LogDev("1685077956 Dev ", res);
        }).catch((err) => __awaiter(this, void 0, void 0, function* () {
            LogController_1.logController.LogWarring(LogCode_1.LogCode.HeroTeam_NotFoundInDB, idUserPlayer + ":" + err, "Server");
            data = null;
        }));
        if (data == null || data == undefined) {
            var heroTeam = new HeroTeam_1.HeroTeam();
            heroTeam.IdUserPlayer = new mongoose_1.Types.ObjectId(idUserPlayer);
            yield HeroTeam_1.HeroTeamModel.create(heroTeam).then(res => {
                data = res;
                LogController_1.logController.LogDev("1685077957 Dev ", res);
            }).catch(err => {
                LogController_1.logController.LogWarring(LogCode_1.LogCode.HeroTeam_CreateNewFail, idUserPlayer + ":" + err, "Server");
                data = heroTeam;
            });
        }
        var heroTeam = DataModel_1.DataModel.Parse(data);
        exports.heroTeamCtrl.SetHeroTeamCached(heroTeam);
        return heroTeam;
    });
}
function UpdateHeroTeam(heroTeamIncome) {
    return __awaiter(this, void 0, void 0, function* () {
        var heroTeam;
        yield HeroTeam_1.HeroTeamModel.updateOne({
            _id: heroTeamIncome._id
        }, {
            Slot1: heroTeamIncome.Slot1,
            Slot2: heroTeamIncome.Slot2,
            Slot3: heroTeamIncome.Slot3,
            Slot4: heroTeamIncome.Slot4,
            Slot5: heroTeamIncome.Slot5,
        }).then((res) => __awaiter(this, void 0, void 0, function* () {
            if (res.modifiedCount == 0 && res.matchedCount == 0) {
                LogController_1.logController.LogError(LogCode_1.LogCode.HeroTeam_NotFoundInDB, heroTeamIncome._id, "Server");
                heroTeam = null;
                return heroTeam;
            }
            else {
                heroTeam = yield FindByIdUserPlayer(heroTeamIncome.IdUserPlayer.toString());
                exports.heroTeamCtrl.SetHeroTeamCached(heroTeam);
                return heroTeam;
            }
        }));
        return heroTeam;
    });
}
