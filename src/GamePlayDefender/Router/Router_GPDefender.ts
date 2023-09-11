import { Message } from "../../MessageServer/Model/Message";
import { controller_GPDefender } from "../Controller/Controller__GPDefender";
import { Message_GPDefender } from "../Model/Message_GPDefender";
import { Room_GPDefender } from "../Model/Room_GPDefender";

export class Router_GPDefender{
    Router(messgae : Message, room : Room_GPDefender){
        if(messgae.MessageCode == Message_GPDefender.player_rotate){
            controller_GPDefender.RotatePlayer(messgae, room);
            return;
        }
        if(messgae.MessageCode == Message_GPDefender.player_fire){
            controller_GPDefender.PlayerFire(messgae, room);
        }
        if(messgae.MessageCode == Message_GPDefender.bullet_impact){
            controller_GPDefender.BulletImpact(messgae, room);
        }
    }
}

export const router_GPDefender = new Router_GPDefender();