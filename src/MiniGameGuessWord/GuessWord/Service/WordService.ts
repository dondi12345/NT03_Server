import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { rootDir } from '../../../../';
import path from 'path';

const LINE_EXPRESSION: RegExp = /\r\n|\n\r|\n|\r/g;

class WordService{
    fourWord : string[]
    fiveWord : string[]
    sixWord : string[]

    constructor(){
        this.fourWord=[];
        this.fiveWord=[];
        this.sixWord=[];
        InitWord(this.fourWord, this.fiveWord, this.sixWord);
    }
}

export const wordService = new WordService();
function InitWord(fourWord, fiveWord, sixWord){
    let result = readFileSync(path.join(rootDir+'/public/resources/guess_word/en4words.txt'), 'utf-8');
    var words = result.split(`\n`);
    words.forEach(element => {
        element = element.toLowerCase( )
        element = element.replace(LINE_EXPRESSION, '')
        if(element.length == 4){
            fourWord.push(element);
        }
    });
    result = readFileSync(path.join(rootDir+ '/public/resources/guess_word/en5words.txt'), 'utf-8');
    words = result.split(`\n`);
    words.forEach(element => {
        element = element.toLowerCase( )
        element = element.replace(LINE_EXPRESSION, '')
        if(element.length == 5){
            fiveWord.push(element);
        }
    });
    result = readFileSync( path.join(rootDir+'/public/resources/guess_word/en6words.txt'), 'utf-8');
    words = result.split(`\n`);
    words.forEach(element => {
        element = element.toLowerCase( )
        element = element.replace(LINE_EXPRESSION, '')
        if(element.length == 6){
            sixWord.push(element);
        }
    });
    console.log("fourWord:"+fourWord.length);
    console.log("fiveWord:"+fiveWord.length);
    console.log("sixWord"+sixWord.length);
}

function WriteWord() {
    const result = readFileSync(path.join(rootDir+ '/public/resources/guess_word/enwords.txt'), 'utf-8');
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
  
export function TestWord() {
    const result = readFileSync(path.join(rootDir+ '/public/resources/guess_word/enwords.txt'), 'utf-8');
    var words = result.split(`\n`);
    for(let round = 0; round < 1000; round++){
        var index = 0;
        var index_1 = 0;
        var keys ="qwrtypsdfghjklzxcvbnm";
        var keysub = "ueoai";
        var sub : string[] = [];
        for(let i = 0; i < 5; i++){
            let index = Math.floor(Math.random()*keys.length);
            sub.push(keys[index]);
            keys = keys.replace(keys[index],"");
        }
        for(let i = 0; i < 2; i++){
            let index = Math.floor(Math.random()*keysub.length);
            sub.push(keysub[index]);
            keysub = keysub.replace(keysub[index],"");
        }
        words.forEach(element => {
            element = element.toLowerCase( )
            element = element.replace(LINE_EXPRESSION, '')
            var same = false;
            for (let index = 0; index < element.length; index++) {
                if(element[index].toString()== sub[0]){
                    same = true;
                    break;
                }
            }
            if(same == true){
                var done = true;
                for (let index = 0; index < element.length; index++) {
                    var same_1 = false;
                    for (let i = 0; i < sub.length; i++) {
                        if(element[index].toString()== sub[i]){
                            same_1 = true;
                            break;
                        }   
                    }
                    if(same_1 == false){
                        done = false;
                        break;
                    }
                }
                if(done == true){
                    index++;
                    if(element.length < 6){
                        index_1++;
                    }
                }
            }
        });
        if(index_1 >=50){
            syncWriteFile("text.txt", sub+"\n");
        }
        
    }

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