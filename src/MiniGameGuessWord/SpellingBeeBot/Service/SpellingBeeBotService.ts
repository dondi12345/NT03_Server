import { SpellingBeeBot } from "../Model/SpellingBeeBot";


class SpellingBeeBotService{

    constructor(){
        var client1 = new SpellingBeeBot();
        client1.Start();
        var client2 = new SpellingBeeBot();
        client2.Start();
        var client3 = new SpellingBeeBot();
        client3.Start();
        var client4 = new SpellingBeeBot();
        client4.Start();
        var client5 = new SpellingBeeBot();
        client5.Start();
        var client6 = new SpellingBeeBot();
        client6.Start();
        var client7 = new SpellingBeeBot();
        client7.Start();
        var client8 = new SpellingBeeBot();
        client8.Start();
        var client9 = new SpellingBeeBot();
        client9.Start();
        var client10 = new SpellingBeeBot();
        client10.Start();
    }
}

export const spellingBeeBotService = new SpellingBeeBotService();