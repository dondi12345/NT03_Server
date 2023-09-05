"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNewestResultRacingHourse = exports.UpdateResultRacingHourse = exports.FindResultRacingHourse = exports.CreateResultRacingHourse = exports.ResultRacingHourseModel = exports.ResultRacingHourse = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const RacingHourseData_1 = require("./RacingHourseData");
class ResultRacingHourse {
}
exports.ResultRacingHourse = ResultRacingHourse;
const ResultRacingHourseSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, default: new mongoose_1.Types.ObjectId() },
    dateCreate: { type: Date },
    racingHourseDatas: { type: [RacingHourseData_1.RacingHourseDataSchema], default: [] },
    dateRacing: { type: Date },
});
exports.ResultRacingHourseModel = mongoose_1.default.model('ResultRacingHourse', ResultRacingHourseSchema);
function CreateResultRacingHourse() {
    return __awaiter(this, void 0, void 0, function* () {
        var resultRacingHourse = new exports.ResultRacingHourseModel();
        resultRacingHourse.dateCreate = new Date();
        yield exports.ResultRacingHourseModel.create(resultRacingHourse).then((res) => {
            resultRacingHourse = res;
        }).catch((err) => {
            throw err;
        });
        return resultRacingHourse;
    });
}
exports.CreateResultRacingHourse = CreateResultRacingHourse;
function FindResultRacingHourse(_id) {
    return __awaiter(this, void 0, void 0, function* () {
        var id = _id;
        var data;
        yield exports.ResultRacingHourseModel.findById(_id).then((res) => {
            data = res;
            console.log("FindResultRacingHourse: \n" + res);
        });
        return data;
    });
}
exports.FindResultRacingHourse = FindResultRacingHourse;
function UpdateResultRacingHourse(resultRacingHourse) {
    return __awaiter(this, void 0, void 0, function* () {
        yield exports.ResultRacingHourseModel.findByIdAndUpdate(resultRacingHourse._id, resultRacingHourse).then(res => {
            console.log("UpdateResultRacingHourse:\n" + res);
        });
    });
}
exports.UpdateResultRacingHourse = UpdateResultRacingHourse;
function GetNewestResultRacingHourse() {
    return __awaiter(this, void 0, void 0, function* () {
        var data;
        const maxVal = yield exports.ResultRacingHourseModel.aggregate([
            { $group: { _id: null, maxField: { $max: '$dateCreate' } } }
        ]).exec();
        yield exports.ResultRacingHourseModel.find({ dateCreate: maxVal[0].maxField }).then(res => {
            console.log("GetNewestResultRacingHourse:\n" + res);
            data = res;
        });
        return data;
    });
}
exports.GetNewestResultRacingHourse = GetNewestResultRacingHourse;
