import { listen } from "@colyseus/arena";
import { configGuessWord } from "./ConfigGameWord";
import { portConfig } from "../Enviroment/Env";
import { guessNumberBotService } from "./GuessWordBot/Service/GuessWordBotService";
import { spellingBeeBotService } from "./SpellingBeeBot/Service/SpellingBeeBotService";
class MiniGameWord{
    Init(){
        listen(configGuessWord, portConfig.portMiniGameWord)
        guessNumberBotService;
        spellingBeeBotService;
    }
    constructor(){
        this.Init();
    }
}

export const miniGameWord = new MiniGameWord();