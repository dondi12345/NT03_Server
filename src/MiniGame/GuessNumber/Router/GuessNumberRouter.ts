import { guessNumberController } from "../Controller/GuessNumberController";
import { StateGuessNumberRoom } from "../Model/GuessNumberStateHandler";
import { Message, MessageCode } from "../Model/Message";

class GuessNumberRouter{
    Router(room : StateGuessNumberRoom, message : Message, sessionId : string){
        if(message.MessageCode == MessageCode.player_answer){
            guessNumberController.PlayerAnswer(room, message, sessionId);
        }
    }
}

export const guessNumberRouter = new GuessNumberRouter();