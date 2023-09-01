import { guessWordService } from "./GuessWord/Service/GuessWordService"
import { guessNumberBotService } from "./GuessWordBot/Service/GuessWordBotService";
class GuessWord{
    constructor(){
        guessWordService;
        guessNumberBotService;
    }
}

export const guessWord = new GuessWord();