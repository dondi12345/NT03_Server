"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heroTeamRouter = void 0;
const MessageCode_1 = require("../../MessageServer/Model/MessageCode");
const HeroTeamCtrl_1 = require("../Controller/HeroTeamCtrl");
class HeroTeamRouter {
    Router(message, transferData) {
        if (message.MessageCode == MessageCode_1.MessageCode.HeroTeam_Login) {
            HeroTeamCtrl_1.heroTeamCtrl.Login(message, transferData);
            return;
        }
        if (message.MessageCode == MessageCode_1.MessageCode.HeroTeam_SelectHero) {
            HeroTeamCtrl_1.heroTeamCtrl.SelectHero(message, transferData);
            return;
        }
        if (message.MessageCode == MessageCode_1.MessageCode.HeroTeam_DeselectHero) {
            HeroTeamCtrl_1.heroTeamCtrl.DeselectHero(message, transferData);
            return;
        }
    }
}
exports.heroTeamRouter = new HeroTeamRouter();
