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
exports.UpdateTicket = exports.UpdateRankOfTicket = exports.GetTicketAndResultById = exports.GetTicketById = exports.GetTicketByIdResultRacingHourse = exports.CreateTicket = exports.TicketModel = exports.Ticket = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ResultRacingHourse_1 = require("./ResultRacingHourse");
class Ticket {
    constructor() {
        this.Rank = 0;
        this.ReceiveGift = false;
    }
}
exports.Ticket = Ticket;
const TicketSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, default: new mongoose_1.Types.ObjectId() },
    IdUserPlayer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'UserPlayer' },
    IdResultRacingHourse: { type: mongoose_1.Schema.Types.ObjectId, ref: 'ResultRacingHourse' },
    NumberHourse: { type: Number },
    Rank: { type: Number, default: 0 },
    ReceiveGift: { type: Boolean, default: false },
});
exports.TicketModel = mongoose_1.default.model('Ticket', TicketSchema);
function CreateTicket(data) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.TicketModel.create(data).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    });
}
exports.CreateTicket = CreateTicket;
function GetTicketByIdResultRacingHourse(idRacingHourse) {
    return __awaiter(this, void 0, void 0, function* () {
        var data;
        console.log(idRacingHourse);
        yield exports.TicketModel.find({}, { IdResultRacingHourse: idRacingHourse }).then(res => {
            console.log(res);
            data = res;
        });
        return data;
    });
}
exports.GetTicketByIdResultRacingHourse = GetTicketByIdResultRacingHourse;
function GetTicketById(_id) {
    return __awaiter(this, void 0, void 0, function* () {
        ResultRacingHourse_1.ResultRacingHourseModel;
        var data;
        yield exports.TicketModel.findById(_id).then(res => {
            data = res;
        });
        console.log(data);
        return data;
    });
}
exports.GetTicketById = GetTicketById;
function GetTicketAndResultById(_id) {
    return __awaiter(this, void 0, void 0, function* () {
        ResultRacingHourse_1.ResultRacingHourseModel;
        var data;
        yield exports.TicketModel.findById(_id).populate('idResultRacingHourse').orFail().then(res => {
            data = res;
        });
        console.log(data);
        return data;
    });
}
exports.GetTicketAndResultById = GetTicketAndResultById;
function UpdateRankOfTicket(resultRacingHourse) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.TicketModel.find({ IdResultRacingHourse: resultRacingHourse._id }).then(res => {
            res.forEach(element => {
                if (resultRacingHourse.racingHourseDatas != undefined && resultRacingHourse.racingHourseDatas != null && resultRacingHourse.racingHourseDatas.length > 0) {
                    var index = element.NumberHourse.valueOf();
                    element.Rank = resultRacingHourse.racingHourseDatas[index].Rank;
                }
                UpdateTicket(element);
            });
        });
    });
}
exports.UpdateRankOfTicket = UpdateRankOfTicket;
function UpdateTicket(ticket) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Update Ticket");
        exports.TicketModel.findByIdAndUpdate(ticket._id, ticket).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    });
}
exports.UpdateTicket = UpdateTicket;
