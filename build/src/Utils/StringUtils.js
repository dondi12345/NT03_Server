"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringUtils = void 0;
class StringUtils {
    StringRepalce(str, index, char) {
        var newChar = "";
        for (let i = 0; i < str.length; i++) {
            if (i == index) {
                newChar += char;
            }
            else {
                newChar += str[i];
            }
        }
        return newChar;
    }
}
exports.stringUtils = new StringUtils();
