"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NTDictionary = void 0;
class NTDictionary {
    constructor() {
        this.dictionary = {};
        this.dictionary = {};
    }
    Get(key) {
        return this.dictionary[key];
    }
    Add(key, value) {
        this.dictionary[key] = value;
    }
    Remove(key) {
        delete this.dictionary[key];
    }
    Count() {
        return Object.keys(this.dictionary).length;
    }
}
exports.NTDictionary = NTDictionary;
