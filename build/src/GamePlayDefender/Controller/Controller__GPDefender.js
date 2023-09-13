"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller_GPDefender = exports.Pos = void 0;
const DataModel_1 = require("../../Utils/DataModel");
exports.Pos = [
    {
        x: -64,
        y: 5,
        z: 35,
    },
    {
        x: -87,
        y: 8,
        z: 47.5,
    },
];
class Controller_GPDefender {
    RotatePlayer(message, room) {
        try {
            var rotateData = DataModel_1.DataModel.Parse(message.Data);
            var player = room.state.players.get(rotateData.player_id);
            if (player == null || player == undefined)
                return;
            player.r_x = rotateData.r_x;
            player.r_y = rotateData.r_y;
            player.r_z = rotateData.r_z;
            player.d_r_x = rotateData.d_r_x;
            player.d_r_y = rotateData.d_r_y;
            player.d_r_z = rotateData.d_r_z;
        }
        catch (error) {
            console.log(error);
        }
    }
    PutPlayer(player_id, room) {
        var player = room.state.players.get(player_id);
        if (player == null || player == undefined)
            return;
        if (room.slot1.length == 0) {
            player.x = exports.Pos[0].x;
            player.y = exports.Pos[0].y;
            player.z = exports.Pos[0].z;
            room.slot1 = player_id;
            return;
        }
        if (room.slot2.length == 0) {
            player.x = exports.Pos[1].x;
            player.y = exports.Pos[1].y;
            player.z = exports.Pos[1].z;
            room.slot2 = player_id;
            return;
        }
    }
    RemoveSlot(player_id, room) {
        if (room.slot1 == player_id) {
            room.slot1 = "";
        }
        if (room.slot2 == player_id) {
            room.slot2 = "";
        }
    }
    PlayerFire(message, room) {
        var bulletData = DataModel_1.DataModel.Parse(message.Data);
        if (bulletData == null || bulletData == undefined)
            return;
        room.state.createBullet(bulletData);
    }
    BulletImpact(message, room) {
        var bulletData = DataModel_1.DataModel.Parse(message.Data);
        if (bulletData == null || bulletData == undefined)
            return;
        room.state.removeBullet(bulletData.bullet_id);
    }
    MonsterSpawn(monsterData, room) {
        if (monsterData == null || monsterData == undefined)
            return;
        room.state.createMonster(monsterData);
    }
    TargetGetDmg(message, room) {
        var damageCharacter = DataModel_1.DataModel.Parse(message.Data);
        var monster = room.state.monsters.get(damageCharacter.TarID);
        try {
            if (monster == undefined || monster == null)
                return;
            monster.hp -= damageCharacter.dmg;
        }
        catch (error) {
        }
    }
}
exports.controller_GPDefender = new Controller_GPDefender();
