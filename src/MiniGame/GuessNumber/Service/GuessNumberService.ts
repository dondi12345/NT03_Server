import { listen } from "@colyseus/tools";
import { portConfig } from "../../../Enviroment/Env";
import { configGuessNumber } from "../ConfigGuessNumber";
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

export type WordDictionary = Record<string, string>;

class GuessNumberService{
    Init(){  
        listen(configGuessNumber,  portConfig.portGuessNumber)
    }
    constructor(){
        this.Init();
    }
}

export const guessNumberService = new GuessNumberService();