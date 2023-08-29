import { GuessNumberBot } from "../Model/GuessNumberBot";

class GuessNumberBotService{
    guessNumberBots : GuessNumberBot[];

    constructor(){
        var client1 = new GuessNumberBot();
        client1.Start();
    }
}

export const guessNumberBotService = new GuessNumberBotService();