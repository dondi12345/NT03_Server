import { Schema, Context, MapSchema, ArraySchema } from "@colyseus/schema";
import { Player_GPDefender } from "./Player_GPDefender";
import { BulletData_GPDefender, Bullet_GPDefender } from "./Bullet_GPDefender";
import { MonsterData_GPDefender, Monster_GPDefender } from "./Monster_GPDefender";
const type = Context.create(); 

export class State_GPDefender extends Schema{
    @type({ map : Player_GPDefender })
    players = new MapSchema<Player_GPDefender>();
    @type({map : Bullet_GPDefender})
    bullets = new MapSchema<Bullet_GPDefender>();
    @type({ map : Monster_GPDefender})
    monsters =  new MapSchema<Monster_GPDefender>();
    @type("number")
    time = 0;

    createPlayer(sessionId: string, name_player : string) {
        var player = new Player_GPDefender();
        player.name_player = name_player;
        this.players.set(sessionId, player);
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }

    createBullet(bulletData : BulletData_GPDefender){
        var bullet = new Bullet_GPDefender();
        bullet.bullet_id = bulletData.bullet_id;
        bullet.player_id = bulletData.player_id;
        bullet.bullet_code = bulletData.bullet_code;
        bullet.time_start = bulletData.time_start;
        bullet.speed = bulletData.speed;
        bullet.x = bulletData.x;
        bullet.y = bulletData.y;
        bullet.z = bulletData.z;
        bullet.r_x = bulletData.r_x;
        bullet.r_y = bulletData.r_y;
        bullet.r_z = bulletData.r_z;
        this.bullets.set(bullet.bullet_id, bullet);
    }

    removeBullet(bullet_id : string){
        this.bullets.delete(bullet_id);
    }

    createMonster(monsterData : MonsterData_GPDefender){
        var monster = new Monster_GPDefender();
        monster.monster_id = monsterData.monster_id;
        monster.monster_code = monsterData.monster_code;
        monster.time_born = monsterData.time_born;
        monster.way_code = monsterData.way_code;
        monster.speed = monsterData.speed;
        monster.hp = monsterData.hp;
        monster.space = monsterData.space;
        this.monsters.set(monster.monster_id, monster);
    }

    removeMonster(monster_id : string){
        this.monsters.delete(monster_id);
    }
}