import { listen } from "@colyseus/arena";
import { configGuessWord } from "../ConfigGuessWord";
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { portConfig } from "../../../Enviroment/Env";

export type WordDictionary = Record<string, string>;

class GuessWordService{
    Init(){
        listen(configGuessWord, portConfig.portGuessNumber)
    }
    constructor(){
        this.Init();
    }
}

export const guessWordService = new GuessWordService();