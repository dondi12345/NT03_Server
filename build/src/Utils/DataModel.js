"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataModel = void 0;
class DataModel {
    static Parse(data) {
        try {
            data = JSON.parse(data);
            try {
                if (typeof data == "string") {
                    data = JSON.parse(data);
                }
            }
            catch (error) { }
        }
        catch (err) { }
        return data;
    }
}
exports.DataModel = DataModel;
