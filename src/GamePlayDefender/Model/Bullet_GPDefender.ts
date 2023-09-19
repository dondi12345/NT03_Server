import { Schema, Context } from "@colyseus/schema";
const type = Context.create(); // this is your @type() decorator bound to a context

export class BulletData_GPDefender{
    bullet_id : string = "";
    player_id : string = "";
    target_id : string = "";
    bullet_code : number = 0;
    time_start : number = 0;

    x = 0;
    y = 0;
    z = 0;

    r_x = 0;
    r_y = 0;
    r_z = 0;

    static New(bullet_id: string, player_id: string, target_id: string, bullet_code : number, time_start : number,
            x : number, y : number, z : number, r_x : number, r_y : number, r_z : number, end_x : number, end_y : number, end_z : number,){
        var bulletData_GPDefender = new BulletData_GPDefender();
        bulletData_GPDefender.bullet_id = bullet_id;
        bulletData_GPDefender.player_id = player_id;
        bulletData_GPDefender.target_id = target_id;
        bulletData_GPDefender.bullet_code = bullet_code;
        bulletData_GPDefender.time_start = time_start;
    
        bulletData_GPDefender.x = x;
        bulletData_GPDefender.y = y;
        bulletData_GPDefender.z = z;
            
        bulletData_GPDefender.r_x = r_x;
        bulletData_GPDefender.r_y = r_y;
        bulletData_GPDefender.r_z = r_z;

        return bulletData_GPDefender;
    }
}

export class Bullet_GPDefender extends Schema{
    @type("string")
    bullet_id = "";
    @type("string")
    player_id = "";
    @type("string")
    target_id = "";
    @type("number")
    bullet_code = 0;
    @type("number")
    time_start = 0;

    @type("number")
    speed = 0;

    @type("number")
    x = 0;
    @type("number")
    y = 0;
    @type("number")
    z = 0;

    @type("number")
    r_x = 0;
    @type("number")
    r_y = 0;
    @type("number")
    r_z = 0;

    ParseFromData(bulletData_GPDefender : BulletData_GPDefender){
        this.bullet_id = bulletData_GPDefender.bullet_id;
        this.player_id = bulletData_GPDefender.player_id;
        this.target_id = bulletData_GPDefender.target_id;
        this.bullet_code = bulletData_GPDefender.bullet_code;
        this.time_start = bulletData_GPDefender.time_start;
    
        this.x = bulletData_GPDefender.x;
        this.y = bulletData_GPDefender.y;
        this.z = bulletData_GPDefender.z;
            
        this.r_x = bulletData_GPDefender.r_x;
        this.r_y = bulletData_GPDefender.r_y;
        this.r_z = bulletData_GPDefender.r_z;
    }
}