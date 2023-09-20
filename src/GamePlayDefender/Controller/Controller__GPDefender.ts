import { Message } from "../../MessageServer/Model/Message";
import { DamageCharacter } from "../../Utils/DamagerCharacter";
import { DataModel } from "../../Utils/DataModel";
import { BulletData_GPDefender } from "../Model/Bullet_GPDefender";
import { Message_GPDefender } from "../Model/Message_GPDefender";
import { MonsterData_GPDefender } from "../Model/Monster_GPDefender";
import { Room_GPDefender } from "../Model/Room_GPDefender";
import { RotateData_GPDefender } from "../Model/RotateData_GPDefender";
import { GameStatus } from "../Model/State_GPDefender";

export const DefenseConfig = {
    hp_barrier : 1000,
    time_start : 15,

}

export const Pos_Player = [
    {
        x : -64,
        y : 5,
        z : 35,
    },
    {
        x : -87,
        y : 8,
        z : 47.5,
    },
]

export const Pos_Barrier = [
    {
        x : -70.56, y : 1, z : 20.18
    },
    {
        x : -65.68, y : 1, z : 20.28
    },
    {
        x : -60.86, y : 1, z : 20.16
    },
    {
        x : -56.2, y : 1, z : 20.12
    },
    {
        x : -80.14, y : 1, z : 20.28
    },
    {
        x : -75.32, y : 1, z : 20.16
    },
    {
        x : -85.08, y : 1, z : 20.12
    },
]

class ChangeGunData{
    player_id : string;
    index_gun : number;
}

class Controller_GPDefender{
    RoomStart(room : Room_GPDefender){
        room.state.hp_barrier = DefenseConfig.hp_barrier;
        room.state.max_hp_barrier = DefenseConfig.hp_barrier;
    }

    RotatePlayer(message : Message, room : Room_GPDefender){
        try {
            var rotateData = DataModel.Parse<RotateData_GPDefender>(message.Data);
            var player = room.state.players.get(rotateData.player_id);
            if(player == null || player == undefined) return;
            player.r_x = rotateData.r_x;
            player.r_y = rotateData.r_y;
            player.r_z = rotateData.r_z;
            player.d_r_x = rotateData.d_r_x;
            player.d_r_y = rotateData.d_r_y;
            player.d_r_z = rotateData.d_r_z;
        } catch (error) {
            console.log(error)
        }
    }

    PutPlayer(player_id, room : Room_GPDefender){
        var player = room.state.players.get(player_id);
        if(player == null || player == undefined) return;
        if(room.slot1.length == 0){
            player.x = Pos_Player[0].x;
            player.y = Pos_Player[0].y;
            player.z = Pos_Player[0].z;
            room.slot1 = player_id;
            return;
        }
        if(room.slot2.length == 0){
            player.x = Pos_Player[1].x;
            player.y = Pos_Player[1].y;
            player.z = Pos_Player[1].z;
            room.slot2 = player_id;
            return;
        }
    }

    RemoveSlot(player_id, room : Room_GPDefender){
        if(room.slot1 == player_id){
            room.slot1 = "";
        }
        if(room.slot2 == player_id){
            room.slot2 = "";
        }
    }

    PlayerFire(message : Message, room : Room_GPDefender){
        var bulletData = DataModel.Parse<BulletData_GPDefender>(message.Data);
        if(bulletData == null || bulletData == undefined) return;
        room.state.createBullet(bulletData);
    }

    BulletImpact(message : Message, room : Room_GPDefender){
        var bulletData = DataModel.Parse<BulletData_GPDefender>(message.Data);
        if(bulletData == null || bulletData == undefined) return;
        room.state.removeBullet(bulletData.bullet_id);
    }

    MonsterSpawn(monsterData : MonsterData_GPDefender, room : Room_GPDefender){
        if(monsterData == null || monsterData == undefined) return;
        return room.state.createMonster(monsterData);
    }
    
    TargetGetDmg(message : Message, room : Room_GPDefender){
        var damageCharacter = DataModel.Parse<DamageCharacter>(message.Data);
        var monster = room.state.monsters.get(damageCharacter.TarID);
        try {
            if(monster == undefined || monster == null) return;
            monster.hp -= damageCharacter.dmg;
            if(monster.hp < 0){
                room.monsterBot.DestroyMonster(monster.monster_id);
                room.state.monsters.delete(monster.monster_id);
                if(room.state.monsters.size == 0){
                    room.state.game_status = GameStatus.win;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    ChangeGun(message : Message, room : Room_GPDefender){
        var changeGunData = DataModel.Parse<ChangeGunData>(message.Data);
        var player = room.state.players.get(changeGunData.player_id);
        try {
            if(player == undefined || player == null) return;
            player.index_gun = changeGunData.index_gun;
        } catch (error) {
            console.log(error);
        }
    }

    BarrierTakeDmg(dmg : number, room : Room_GPDefender){
        room.state.hp_barrier -= dmg;
        if(room.state.hp_barrier <= 0){
            room.state.game_status = GameStatus.lose;
        }
    }
}

export const controller_GPDefender = new Controller_GPDefender();