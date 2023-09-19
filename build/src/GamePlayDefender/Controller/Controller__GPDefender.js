"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller_GPDefender = exports.Pos_Barrier = exports.Pos_Player = exports.DefenseConfig = void 0;
const DataModel_1 = require("../../Utils/DataModel");
const State_GPDefender_1 = require("../Model/State_GPDefender");
exports.DefenseConfig = {
    hp_barrier: 1000,
    time_start: 15,
};
exports.Pos_Player = [
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
exports.Pos_Barrier = [
    {
        x: -70.56, y: 1, z: 20.18
    },
    {
        x: -65.68, y: 1, z: 20.28
    },
    {
        x: -60.86, y: 1, z: 20.16
    },
    {
        x: -56.2, y: 1, z: 20.12
    },
    {
        x: -80.14, y: 1, z: 20.28
    },
    {
        x: -75.32, y: 1, z: 20.16
    },
    {
        x: -85.08, y: 1, z: 20.12
    },
];
class Controller_GPDefender {
    RoomStart(room) {
        room.state.hp_barrier = exports.DefenseConfig.hp_barrier;
        room.state.max_hp_barrier = exports.DefenseConfig.hp_barrier;
    }
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
            player.x = exports.Pos_Player[0].x;
            player.y = exports.Pos_Player[0].y;
            player.z = exports.Pos_Player[0].z;
            room.slot1 = player_id;
            return;
        }
        if (room.slot2.length == 0) {
            player.x = exports.Pos_Player[1].x;
            player.y = exports.Pos_Player[1].y;
            player.z = exports.Pos_Player[1].z;
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
        return room.state.createMonster(monsterData);
    }
    TargetGetDmg(message, room) {
        var damageCharacter = DataModel_1.DataModel.Parse(message.Data);
        var monster = room.state.monsters.get(damageCharacter.TarID);
        try {
            if (monster == undefined || monster == null)
                return;
            monster.hp -= damageCharacter.dmg;
            if (monster.hp < 0) {
                room.monsterBot.DestroyMonster(monster.monster_id);
                room.state.monsters.delete(monster.monster_id);
                if (room.state.monsters.size == 0) {
                    room.state.game_status = State_GPDefender_1.GameStatus.win;
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    BarrierTakeDmg(dmg, room) {
        room.state.hp_barrier -= dmg;
        if (room.state.hp_barrier <= 0) {
            room.state.game_status = State_GPDefender_1.GameStatus.lose;
        }
    }
}
exports.controller_GPDefender = new Controller_GPDefender();
