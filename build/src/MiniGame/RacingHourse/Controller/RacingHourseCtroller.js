"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.effectModelCollections = exports.Effect = exports.GetEffectByRate = exports.TotalRate = exports.InitRacingHourseData = exports.InitListRacingHourseData = exports.RacingHourse = exports.CreateRacingHourse = exports.RacingHourseManager = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Env_1 = require("../../../Enviroment/Env");
const EffectCode_1 = require("../Model/EffectCode");
const RacingHourseData_1 = require("../Model/RacingHourseData");
const ResultRacingHourse_1 = require("../Model/ResultRacingHourse");
const Ticket_1 = require("../Model/Ticket");
let idCurrentRacingHourse = new mongoose_1.default.Types.ObjectId("64464d6a5b090c6657e54f70");
function RacingHourseManager() {
    // const dateCreate = new Date(2023, 3, 27, 15, 2, 0);
    // const jobCreate = scheduleJob(dateCreate,()=> CreateRacingHourse());
    // const dateRacing = new Date(2023, 3, 27, 15, 29, 0);
    // const jobRacing = scheduleJob(dateRacing,()=> RacingHourse());
    CreateRacingHourse().then((res) => {
        RacingHourse();
    });
}
exports.RacingHourseManager = RacingHourseManager;
function CreateRacingHourse() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, ResultRacingHourse_1.CreateResultRacingHourse)().then((res) => {
            console.log("Create race");
        }).catch((err) => {
            throw err;
        });
    });
}
exports.CreateRacingHourse = CreateRacingHourse;
function RacingHourse() {
    console.log("Racing");
    ResultRacingHourse_1.ResultRacingHourseModel.find({ dateRacing: { $exists: false } }).then(res => {
        if (res.length == 0)
            return;
        res.forEach(element => {
            element.racingHourseDatas = [];
            element.dateRacing = new Date();
            element.racingHourseDatas = InitListRacingHourseData();
            (0, ResultRacingHourse_1.UpdateResultRacingHourse)(element);
            (0, Ticket_1.UpdateRankOfTicket)(element);
        });
    });
}
exports.RacingHourse = RacingHourse;
function InitListRacingHourseData() {
    var racingHourseDatas = [];
    for (let i = 0; i < Env_1.variable.maxLandRacingHourse; i++) {
        var racingHourseData = InitRacingHourseData();
        racingHourseData.Rank = 1;
        for (let index = 0; index < racingHourseDatas.length; index++) {
            const element = racingHourseDatas[index];
            if (racingHourseData.TotalTime < element.TotalTime) {
                element.Rank++;
            }
            else {
                racingHourseData.Rank++;
            }
        }
        racingHourseDatas.push(racingHourseData);
    }
    return racingHourseDatas;
}
exports.InitListRacingHourseData = InitListRacingHourseData;
function InitRacingHourseData() {
    var racingHourseData = new RacingHourseData_1.RacingHourseData();
    racingHourseData.EffectCodes.push(EffectCode_1.EffectCode.nonEffect);
    racingHourseData.EffectCodes.push(EffectCode_1.EffectCode.nonEffect);
    racingHourseData.TotalTime = 3;
    let timeOver = 1;
    let countAffect = 0;
    let totalRate = TotalRate();
    for (let i = 2; i < Env_1.variable.maxStepRacingHourse - 2; i++) {
        racingHourseData.TotalTime += timeOver;
        let rate = Math.random() * totalRate;
        var effect = GetEffectByRate(rate);
        countAffect -= 1;
        if (countAffect < 0)
            timeOver = 1;
        racingHourseData.EffectCodes[i] = effect.effectCode;
        if (effect.effectCode == EffectCode_1.EffectCode.nonEffect)
            continue;
        ;
        timeOver = effect.timeOver;
        countAffect = effect.countEffect;
    }
    racingHourseData.TotalTime += timeOver;
    countAffect -= 1;
    if (countAffect <= 0)
        timeOver = 1;
    racingHourseData.EffectCodes.push(EffectCode_1.EffectCode.nonEffect);
    racingHourseData.TotalTime += timeOver;
    countAffect -= 1;
    if (countAffect <= 0)
        timeOver = 1;
    racingHourseData.EffectCodes.push(EffectCode_1.EffectCode.nonEffect);
    return racingHourseData;
}
exports.InitRacingHourseData = InitRacingHourseData;
function TotalRate() {
    let total = 0;
    exports.effectModelCollections.forEach(item => {
        total += item.appearRate;
    });
    return total;
}
exports.TotalRate = TotalRate;
function GetEffectByRate(rate) {
    var data = exports.effectModelCollections[0];
    for (let index = 0; index < exports.effectModelCollections.length; index++) {
        const element = exports.effectModelCollections[index];
        if (rate < element.appearRate) {
            data = element;
            break;
        }
        rate -= element.appearRate;
    }
    return data;
}
exports.GetEffectByRate = GetEffectByRate;
class Effect {
}
exports.Effect = Effect;
exports.effectModelCollections = [
    {
        appearRate: 50,
        effectCode: EffectCode_1.EffectCode.nonEffect,
        timeOver: 0,
        countEffect: 0,
    },
    {
        appearRate: 20,
        effectCode: EffectCode_1.EffectCode.boom,
        timeOver: 3,
        countEffect: 0,
    },
    {
        appearRate: 30,
        effectCode: EffectCode_1.EffectCode.slow,
        timeOver: 1.5,
        countEffect: 1,
    },
    {
        appearRate: 30,
        effectCode: EffectCode_1.EffectCode.speed,
        timeOver: 0.5,
        countEffect: 3,
    },
];
