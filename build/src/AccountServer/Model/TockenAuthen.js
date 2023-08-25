"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TockenAuthen = void 0;
class TockenAuthen {
    constructor() {
    }
    static Parse(data) {
        try {
            data = JSON.parse(data);
        }
        catch (err) { }
        return data;
    }
}
exports.TockenAuthen = TockenAuthen;
