import { listen } from "@colyseus/arena";
import { configGuessWord } from "../ConfigGuessWord";
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

export type WordDictionary = Record<string, string>;

class GuessWordService{
    Init(){
        listen(configGuessWord,  3007)
    }
    constructor(){
        this.Init();
    }
}

export const guessWordService = new GuessWordService();