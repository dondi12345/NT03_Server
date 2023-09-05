"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.func = void 0;
module.exports = {
    equal: (a, b) => {
        if (a == b) {
            return true;
        }
        else {
            return false;
        }
    },
    more: (a, b) => {
        let f = parseInt(a);
        let s = parseInt(b);
        if (f > s) {
            return true;
        }
        else {
            return false;
        }
    },
    mod: (a, b) => {
        let f = parseInt(a);
        let s = parseInt(b);
        if (f % s == 0) {
            return true;
        }
        else {
            return false;
        }
    },
    diff: (a) => {
        if (a) {
            return false;
        }
        else {
            return true;
        }
    },
    sum: (a, b) => {
        let sum = parseInt(a) + parseInt(b);
        return sum;
    },
    multi: (a, b) => a * b,
};
const handlebars_1 = __importDefault(require("handlebars"));
exports.func = handlebars_1.default.registerHelper('times', function (n, block) {
    var accum = '';
    for (var index = 0; index < n; ++index)
        accum += block.fn(index);
    return accum;
});
