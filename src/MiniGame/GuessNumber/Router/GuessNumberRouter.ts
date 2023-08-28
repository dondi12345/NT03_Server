import { Message } from "../../../MessageServer/Model/Message";
import { guessNumberController } from "../Controller/GuessNumberController";
import { StateGuessNumberRoom } from "../Model/GuessNumberStateHandler";
import { MessageGuessNumber } from "../Model/MessageGuessNumber";

class GuessNumberRouter{
    Router(room : StateGuessNumberRoom, message : Message, sessionId : string){
        if(message.MessageCode == MessageGuessNumber.player_answer){
            guessNumberController.PlayerAnswer(room, message, sessionId);
        }
    }
}

export const guessNumberRouter = new GuessNumberRouter();