import { GuessWordBot } from "../Model/GuessWordBot";

class GuessWordBotService{
    guessNumberBots : GuessWordBot[];

    constructor(){
        var client1 = new GuessWordBot();
        client1.Start();
        var client2 = new GuessWordBot();
        client2.Start();
        var client3 = new GuessWordBot();
        client3.Start();
        var client4 = new GuessWordBot();
        client4.Start();
        var client5 = new GuessWordBot();
        client5.Start();
        var client6 = new GuessWordBot();
        client6.Start();
        var client7 = new GuessWordBot();
        client7.Start();
        var client8 = new GuessWordBot();
        client8.Start();
        var client9 = new GuessWordBot();
        client9.Start();
        var client10 = new GuessWordBot();
        client10.Start();
    }
}

export const guessNumberBotService = new GuessWordBotService();