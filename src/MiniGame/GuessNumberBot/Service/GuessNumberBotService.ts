import { GuessNumberBot } from "../Model/GuessNumberBot";

class GuessNumberBotService{
    guessNumberBots : GuessNumberBot[];

    constructor(){
        var client1 = new GuessNumberBot();
        client1.Start();
        var client2 = new GuessNumberBot();
        client2.Start();
        var client3 = new GuessNumberBot();
        client3.Start();
        var client4 = new GuessNumberBot();
        client4.Start();
        var client5 = new GuessNumberBot();
        client5.Start();
        var client6 = new GuessNumberBot();
        client6.Start();
        var client7 = new GuessNumberBot();
        client7.Start();
        var client8 = new GuessNumberBot();
        client8.Start();
        var client9 = new GuessNumberBot();
        client9.Start();
        var client10 = new GuessNumberBot();
        client10.Start();;
    }
}

export const guessNumberBotService = new GuessNumberBotService();