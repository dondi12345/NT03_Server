"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitRes = exports.DataResService = void 0;
const Res_1 = require("../Model/Res");
const DataRes_1 = require("../DataRes");
function InitRes() {
    exports.DataResService = {};
    DataRes_1.DataRes.forEach(element => {
        var dataRes = Res_1.ResData.Parse(element);
        exports.DataResService[element.Code] = dataRes;
    });
    console.log("Dev 1686211076 InitRes " + Object.keys(exports.DataResService).length);
}
exports.InitRes = InitRes;
