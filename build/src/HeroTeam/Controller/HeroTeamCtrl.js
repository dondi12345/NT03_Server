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
exports.RemoveSlotHeroTeamCtrl = exports.UpdateHeroTeamCtrl = exports.DeselectHeroTeamCtrl = exports.SelectHeroTeamCtrl = exports.HeroTeamLogin = void 0;
const mongoose_1 = require("mongoose");
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const Message_1 = require("../../MessageServer/Model/Message");
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const MessageService_1 = require("../../MessageServer/Service/MessageService");
const HeroTeam_1 = require("../Model/HeroTeam");
function HeroTeamLogin(message, userSocket) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, HeroTeam_1.FindHeroTeamByIdUserPlayer)(userSocket.IdUserPlayer).then((respone) => __awaiter(this, void 0, void 0, function* () {
            if (respone == null || respone == undefined) {
                var heroTeam = new HeroTeam_1.HeroTeam();
                heroTeam.IdUserPlayer = userSocket.IdUserPlayer;
                yield (0, HeroTeam_1.CreateHeroTeam)(heroTeam).then(respone => {
                    console.log("Dev 1684837964 " + respone);
                    userSocket.HeroTeam = respone;
                    (0, MessageService_1.SendMessageToSocket)(LoginSuccessMessage(userSocket.HeroTeam), userSocket.Socket);
                }).catch(() => {
                    LoginFail(userSocket);
                });
            }
            else {
                console.log("Dev 1684837893 " + respone);
                userSocket.HeroTeam = respone;
                (0, MessageService_1.SendMessageToSocket)(LoginSuccessMessage(userSocket.HeroTeam), userSocket.Socket);
            }
        })).catch(() => {
            LoginFail(userSocket);
        });
    });
}
exports.HeroTeamLogin = HeroTeamLogin;
function LoginFail(userSocket) {
    (0, MessageService_1.SendMessageToSocket)(LoginFailMessage(), userSocket.Socket);
}
function LoginFailMessage() {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.HeroTeam_LoginFail;
    return message;
}
function LoginSuccessMessage(heroTeam) {
    var message = new Message_1.Message();
    message.MessageCode = MessageCode_1.MessageCode.HeroTeam_LoginSuccess;
    message.Data = JSON.stringify(heroTeam);
    return message;
}
function SelectHeroTeamCtrl(message, userSocket) {
    return __awaiter(this, void 0, void 0, function* () {
        var selectHero = HeroTeam_1.SelectHero.Parse(message.Data);
        try {
            yield (0, HeroTeam_1.FindHeroTeamByIdUserPlayer)(userSocket.IdUserPlayer).then((res) => {
                if (res == null || res == undefined)
                    return;
                if (selectHero.IndexSlot == 1) {
                    res.Slot1 = new mongoose_1.Types.ObjectId(selectHero.IdHero);
                }
                if (selectHero.IndexSlot == 2) {
                    res.Slot2 = new mongoose_1.Types.ObjectId(selectHero.IdHero);
                }
                if (selectHero.IndexSlot == 3) {
                    res.Slot3 = new mongoose_1.Types.ObjectId(selectHero.IdHero);
                }
                if (selectHero.IndexSlot == 4) {
                    res.Slot4 = new mongoose_1.Types.ObjectId(selectHero.IdHero);
                }
                if (selectHero.IndexSlot == 5) {
                    res.Slot5 = new mongoose_1.Types.ObjectId(selectHero.IdHero);
                }
                var messageCall = new Message_1.Message();
                messageCall.MessageCode = MessageCode_1.MessageCode.HeroTeam_Update;
                messageCall.Data = JSON.stringify(res);
                UpdateHeroTeamCtrl(messageCall, userSocket);
            });
        }
        catch (error) {
            (0, LogController_1.LogUserSocket)(LogCode_1.LogCode.HeroTeam_SelectHeroFail, userSocket, error);
        }
    });
}
exports.SelectHeroTeamCtrl = SelectHeroTeamCtrl;
function DeselectHeroTeamCtrl(message, userSocket) {
    return __awaiter(this, void 0, void 0, function* () {
        var selectHero = HeroTeam_1.SelectHero.Parse(message.Data);
        try {
            yield (0, HeroTeam_1.FindHeroTeamByIdUserPlayer)(userSocket.IdUserPlayer).then((res) => {
                var _a, _b, _c, _d, _e;
                if (res == null || res == undefined)
                    return;
                if (((_a = res.Slot1) === null || _a === void 0 ? void 0 : _a.toString()) == selectHero.IdHero) {
                    res['Slot1'] = undefined;
                }
                if (((_b = res.Slot2) === null || _b === void 0 ? void 0 : _b.toString()) == selectHero.IdHero) {
                    res['Slot2'] = undefined;
                }
                if (((_c = res.Slot3) === null || _c === void 0 ? void 0 : _c.toString()) == selectHero.IdHero) {
                    res['Slot3'] = undefined;
                }
                if (((_d = res.Slot4) === null || _d === void 0 ? void 0 : _d.toString()) == selectHero.IdHero) {
                    res['Slot4'] = undefined;
                }
                if (((_e = res.Slot5) === null || _e === void 0 ? void 0 : _e.toString()) == selectHero.IdHero) {
                    res['Slot5'] = undefined;
                }
                RemoveSlotHeroTeamCtrl(res, userSocket);
            });
        }
        catch (error) {
            (0, LogController_1.LogUserSocket)(LogCode_1.LogCode.HeroTeam_SelectHeroFail, userSocket, error);
        }
    });
}
exports.DeselectHeroTeamCtrl = DeselectHeroTeamCtrl;
function UpdateHeroTeamCtrl(message, userSocket) {
    try {
        var heroTeam = HeroTeam_1.HeroTeam.Parse(message.Data);
        (0, HeroTeam_1.UpdateHeroTeam)(heroTeam);
        var messageBack = new Message_1.Message();
        messageBack.MessageCode = MessageCode_1.MessageCode.HeroTeam_Update;
        messageBack.Data = JSON.stringify(heroTeam);
        (0, MessageService_1.SendMessageToSocket)(messageBack, userSocket.Socket);
    }
    catch (error) {
        (0, LogController_1.LogUserSocket)(LogCode_1.LogCode.HeroTeam_UpdateFail, userSocket, error);
    }
}
exports.UpdateHeroTeamCtrl = UpdateHeroTeamCtrl;
function RemoveSlotHeroTeamCtrl(heroTeam, userSocket) {
    try {
        var messageCall = new Message_1.Message();
        messageCall.MessageCode = MessageCode_1.MessageCode.HeroTeam_Update;
        messageCall.Data = JSON.stringify(heroTeam);
        UpdateHeroTeamCtrl(messageCall, userSocket);
        (0, HeroTeam_1.RemoveSlotHeroTeam)(heroTeam);
    }
    catch (error) {
        (0, LogController_1.LogUserSocket)(LogCode_1.LogCode.HeroTeam_RemoveSlotFail, userSocket, error);
    }
}
exports.RemoveSlotHeroTeamCtrl = RemoveSlotHeroTeamCtrl;
