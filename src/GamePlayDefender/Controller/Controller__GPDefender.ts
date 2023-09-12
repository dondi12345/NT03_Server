import { Message } from "../../MessageServer/Model/Message";
import { DataModel } from "../../Utils/DataModel";
import { BulletData_GPDefender } from "../Model/Bullet_GPDefender";
import { MonsterData_GPDefender } from "../Model/Monster_GPDefender";
import { Room_GPDefender } from "../Model/Room_GPDefender";
import { RotateData_GPDefender } from "../Model/RotateData_GPDefender";

export const Pos = [
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

class Controller_GPDefender{
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
            player.x = Pos[0].x;
            player.y = Pos[0].y;
            player.z = Pos[0].z;
            room.slot1 = player_id;
            return;
        }
        if(room.slot2.length == 0){
            player.x = Pos[1].x;
            player.y = Pos[1].y;
            player.z = Pos[1].z;
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
        room.state.createMonster(monsterData);
    }
}

export const controller_GPDefender = new Controller_GPDefender();