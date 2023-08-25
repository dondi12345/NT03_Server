import { listen } from "@colyseus/tools";
import { portConfig } from "../../Enviroment/Env";
import { configGuessNumber } from "./ConfigGuessNumber";
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

export type WordDictionary = Record<string, string>;

const LINE_EXPRESSION: RegExp = /\r\n|\n\r|\n|\r/g;
class GuessNumberService{
    fourWord : string[]
    fiveWord : string[]
    sixWord : string[]

    Init(){
        this.fourWord = [];
        this.fiveWord = [];
        this.sixWord = [];
        InitWord(this.fourWord, this.fiveWord, this.sixWord);
        listen(configGuessNumber,  portConfig.portGuessNumber)
    }
    constructor(){
        this.Init();
    }
}

export const guessNumberService = new GuessNumberService();

function InitWord(fourWord, fiveWord, sixWord){
    let result = readFileSync(join(__dirname, './en4words.txt'), 'utf-8');
    var words = result.split(`\n`);
    words.forEach(element => {
        element = element.toLowerCase( )
        element = element.replace(LINE_EXPRESSION, '')
        if(element.length == 4){
            fourWord.push(element);
        }
    });
    result = readFileSync(join(__dirname, './en5words.txt'), 'utf-8');
    words = result.split(`\n`);
    words.forEach(element => {
        element = element.toLowerCase( )
        element = element.replace(LINE_EXPRESSION, '')
        if(element.length == 5){
            fiveWord.push(element);
        }
    });
    result = readFileSync(join(__dirname, './en6words.txt'), 'utf-8');
    words = result.split(`\n`);
    words.forEach(element => {
        element = element.toLowerCase( )
        element = element.replace(LINE_EXPRESSION, '')
        if(element.length == 6){
            sixWord.push(element);
        }
    });
    console.log(fourWord.length);
    console.log(fiveWord.length);
    console.log(sixWord.length);
}

function WriteWord() {
    const result = readFileSync(join(__dirname, './enwords.txt'), 'utf-8');
    var words = result.split(`\n`);
    words.forEach(element => {
        element = element.toLowerCase( )
        element = element.replace(LINE_EXPRESSION, '')
        if(element.length == 4){
            syncWriteFile("en4words.txt", element+"\n");
        }
        if(element.length == 5){
            syncWriteFile("en5words.txt", element+"\n");
        }
        if(element.length == 6){
            syncWriteFile("en6words.txt", element+"\n");
        }
    });
  
    return result;
  }

  function syncWriteFile(filename: string, data: any) {
    /**
     * flags:
     *  - w = Open file for reading and writing. File is created if not exists
     *  - a+ = Open file for reading and appending. The file is created if not exists
     */
    writeFileSync(join(__dirname, filename), data, {
      flag: 'a',
    });
  
    const contents = readFileSync(join(__dirname, filename), 'utf-8');
    return contents;
  }