"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataVersion = void 0;
class DataVersion {
    constructor() {
        this.Version = 0;
    }
    static Parse(data) {
        try {
            data = JSON.parse(data);
        }
        catch (err) { }
        return data;
    }
}
exports.DataVersion = DataVersion;
// const DataVersionSchema = new Schema<DataVersion>(
//     {
//       _id : { type: Schema.Types.ObjectId, default: new Types.ObjectId()},
//       Name :{type : String},
//       Version :{type : Number},
//       Data :{},
//     }
// );
// export const DataVersionModel = mongoose.model<DataVersion>('DataVersion', DataVersionSchema);
// export async function GetDataVersionByName(name : string, callback){
//     await DataVersionModel.findOne({Name : name}).then((res)=>{
//         callback(null, res);
//     }).catch((err)=>{
//         callback(err, null);
//     })
// }
