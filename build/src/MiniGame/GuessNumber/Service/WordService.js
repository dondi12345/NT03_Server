"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordService = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
const __1 = require("../../../..");
const path_2 = __importDefault(require("path"));
const LINE_EXPRESSION = /\r\n|\n\r|\n|\r/g;
class WordService {
    constructor() {
        this.fourWord = [];
        this.fiveWord = [];
        this.sixWord = [];
        InitWord(this.fourWord, this.fiveWord, this.sixWord);
    }
}
exports.wordService = new WordService();
function InitWord(fourWord, fiveWord, sixWord) {
    let result = (0, fs_1.readFileSync)(path_2.default.join(__1.rootDir + '/public/resources/guess_word/en4words.txt'), 'utf-8');
    var words = result.split(`\n`);
    words.forEach(element => {
        element = element.toLowerCase();
        element = element.replace(LINE_EXPRESSION, '');
        if (element.length == 4) {
            fourWord.push(element);
        }
    });
    result = (0, fs_1.readFileSync)(path_2.default.join(__1.rootDir + '/public/resources/guess_word/en5words.txt'), 'utf-8');
    words = result.split(`\n`);
    words.forEach(element => {
        element = element.toLowerCase();
        element = element.replace(LINE_EXPRESSION, '');
        if (element.length == 5) {
            fiveWord.push(element);
        }
    });
    result = (0, fs_1.readFileSync)(path_2.default.join(__1.rootDir + '/public/resources/guess_word/en6words.txt'), 'utf-8');
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
    const result = (0, fs_1.readFileSync)(path_2.default.join(__1.rootDir + '/public/resources/guess_word/enwords.txt'), 'utf-8');
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
