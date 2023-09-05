"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RacingHourseDataSchema = exports.RacingHourseData = void 0;
const mongoose_1 = require("mongoose");
class RacingHourseData {
    constructor() {
        this.EffectCodes = [];
        this.TotalTime = 0;
    }
}
exports.RacingHourseData = RacingHourseData;
exports.RacingHourseDataSchema = new mongoose_1.Schema({
    EffectCodes: { type: [] },
    TotalTime: { type: Number, default: 0 },
    Rank: { type: Number }
});
