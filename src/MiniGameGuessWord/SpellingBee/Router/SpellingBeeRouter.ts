import { Message } from "../../../MessageServer/Model/Message";
import { spellingBeeController } from "../Controller/SpellingBeeController";
import { MessageSpellingBee } from "../Model/MessageSpellingBee";
import { StateSpellingBeeRoom } from "../Model/SpellingBeeStateHandler";

class SpellingBeeRouter{
    Router(room : StateSpellingBeeRoom, message : Message, sessionId : string){
        if(message.MessageCode == MessageSpellingBee.player_answer){
            spellingBeeController.PlayerAnswer(room, message, sessionId);
        }
    }
}

export const spellingBeeRouter = new SpellingBeeRouter();