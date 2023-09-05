"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guessNumberService = void 0;
const tools_1 = require("@colyseus/tools");
const Env_1 = require("../../Enviroment/Env");
const ConfigGuessNumber_1 = require("./ConfigGuessNumber");
const path_1 = require("path");
const fs_1 = require("fs");
const LINE_EXPRESSION = /\r\n|\n\r|\n|\r/g;
class GuessNumberService {
    Init() {
        this.fourWord = [];
        this.fiveWord = [];
        this.sixWord = [];
        InitWord(this.fourWord, this.fiveWord, this.sixWord);
        (0, tools_1.listen)(ConfigGuessNumber_1.configGuessNumber, Env_1.portConfig.portGuessNumber);
    }
    constructor() {
        this.Init();
    }
}
exports.guessNumberService = new GuessNumberService();
function InitWord(fourWord, fiveWord, sixWord) {
    let result = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, './en4words.txt'), 'utf-8');
    var words = result.split(`\n`);
    words.forEach(element => {
        element = element.toLowerCase();
        element = element.replace(LINE_EXPRESSION, '');
        if (element.length == 4) {
            fourWord.push(element);
        }
    });
    result = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, './en5words.txt'), 'utf-8');
    words = result.split(`\n`);
    words.forEach(element => {
        element = element.toLowerCase();
        element = element.replace(LINE_EXPRESSION, '');
        if (element.length == 5) {
            fiveWord.push(element);
        }
    });
    result = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, './en6words.txt'), 'utf-8');
    words = result.split(`\n`);
    words.forEach(element => {
        element = element.toLowerCase();
        element = element.replace(LINE_EXPRESSION, '');
        if (element.length == 6) {
            sixWord.push(element);
        }
    });
    console.log(fourWord.length);
    console.log(fiveWord.length);
    console.log(sixWord.length);
}
function WriteWord() {
    const result = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, './enwords.txt'), 'utf-8');
    var words = result.split(`\n`);
    words.forEach(element => {
        element = element.toLowerCase();
        element = element.replace(LINE_EXPRESSION, '');
        if (element.length == 4) {
            syncWriteFile("en4words.txt", element + "\n");
        }
        if (element.length == 5) {
            syncWriteFile("en5words.txt", element + "\n");
        }
        if (element.length == 6) {
            syncWriteFile("en6words.txt", element + "\n");
        }
    });
    return result;
}
function syncWriteFile(filename, data) {
    /**
     * flags:
     *  - w = Open file for reading and writing. File is created if not exists
     *  - a+ = Open file for reading and appending. The file is created if not exists
     */
    (0, fs_1.writeFileSync)((0, path_1.join)(__dirname, filename), data, {
        flag: 'a',
    });
    const contents = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, filename), 'utf-8');
    return contents;
}
