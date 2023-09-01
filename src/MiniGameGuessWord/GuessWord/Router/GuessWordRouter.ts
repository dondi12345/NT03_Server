import { Message } from "../../../MessageServer/Model/Message";
import { guessWordController } from "../Controller/GuessWordController";
import { StateGuessWordRoom } from "../Model/GuessWordStateHandler";
import { MessageGuessWord as MessageGuessWord } from "../Model/MessageGuessWord";

class GuessWordRouter{
    Router(room : StateGuessWordRoom, message : Message, sessionId : string){
        if(message.MessageCode == MessageGuessWord.player_answer){
            guessWordController.PlayerAnswer(room, message, sessionId);
        }
    }
}

export const guessWordRouter = new GuessWordRouter();