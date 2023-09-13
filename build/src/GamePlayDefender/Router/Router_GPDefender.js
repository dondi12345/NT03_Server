"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router_GPDefender = exports.Router_GPDefender = void 0;
const Controller__GPDefender_1 = require("../Controller/Controller__GPDefender");
const Message_GPDefender_1 = require("../Model/Message_GPDefender");
class Router_GPDefender {
    Router(messgae, room) {
        if (messgae.MessageCode == Message_GPDefender_1.Message_GPDefender.player_rotate) {
            Controller__GPDefender_1.controller_GPDefender.RotatePlayer(messgae, room);
            return;
        }
        if (messgae.MessageCode == Message_GPDefender_1.Message_GPDefender.player_fire) {
            Controller__GPDefender_1.controller_GPDefender.PlayerFire(messgae, room);
        }
        if (messgae.MessageCode == Message_GPDefender_1.Message_GPDefender.bullet_impact) {
            Controller__GPDefender_1.controller_GPDefender.BulletImpact(messgae, room);
        }
        if (messgae.MessageCode == Message_GPDefender_1.Message_GPDefender.target_get_dmg) {
            Controller__GPDefender_1.controller_GPDefender.TargetGetDmg(messgae, room);
        }
    }
}
exports.Router_GPDefender = Router_GPDefender;
exports.router_GPDefender = new Router_GPDefender();
