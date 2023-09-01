import { listen } from "@colyseus/arena";
import { configGuessWord } from "./ConfigGameWord";
import { portConfig } from "../Enviroment/Env";
import { guessNumberBotService } from "./GuessWordBot/Service/GuessWordBotService";
class MiniGameWord{
    Init(){
        listen(configGuessWord, portConfig.portMiniGameWord)
        guessNumberBotService;
    }
    constructor(){
        this.Init();
    }
}

export const miniGameWord = new MiniGameWord();