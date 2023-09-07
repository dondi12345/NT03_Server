import { Message } from "../../MessageServer/Model/Message";
import { controller__GPDefender } from "../Controller/Controller__GPDefender";
import { Room_GPDefender } from "../Model/Room_GPDefender";

export class Router_GPDefender{
    Router(messgae : Message, room : Room_GPDefender){
        controller__GPDefender.RotatePlayer(messgae, room);
    }
}

export const router_GPDefender = new Router_GPDefender();