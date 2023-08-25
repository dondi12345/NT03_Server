"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SummonHero = exports.SummonHeroSlot = void 0;
const mongoose_1 = require("mongoose");
class SummonHeroSlot {
    constructor() {
        this._id = new mongoose_1.Types.ObjectId();
        this.Hired = false;
    }
    static Parse(data) {
        try {
            return JSON.parse(data);
        }
        catch (_a) {
            return data;
        }
    }
}
exports.SummonHeroSlot = SummonHeroSlot;
class SummonHero {
}
exports.SummonHero = SummonHero;
