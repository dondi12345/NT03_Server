import mongoose, { Schema, Types } from "mongoose";
import { DefaultCurrency } from "./DefaultCurrency";

export interface ICurrency{
    IdUserPlayer : Types.ObjectId,

    //Resource
    Diamond : number,
    Money : number,
    Food : number,
    Gold : number,
    Silver : number,
    EnchanceStone : number,
}

export class Currency implements ICurrency{
    IdUserPlayer : Types.ObjectId;

    Diamond : number;
    Money : number;
    Food : number;
    Gold : number;
    Silver : number;
    EnchanceStone : number;
    constructor() {
        
    }

    static Parse(data) : ICurrency{
        try{
            data = JSON.parse(data);
        }catch(err){}
        return data;
    }
}

const CurrencySchema = new Schema<ICurrency>(
    {
        IdUserPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPlayer' },

        Diamond : { type : Number, default : DefaultCurrency.Diamond},
        Money : { type : Number, default : DefaultCurrency.Money},
        Food : { type : Number, default : DefaultCurrency.Food},
        Gold : { type : Number, default : DefaultCurrency.Gold},
        Silver : { type : Number, default : DefaultCurrency.Silver},
        EnchanceStone : { type : Number, default : DefaultCurrency.EnchanceStone},
    }
);
  
export const CurrencyModel = mongoose.model<ICurrency>('Currency', CurrencySchema);

export async function CreateUserPlayerCurrency(data : ICurrency){
    var userPlayerRes;
    await CurrencyModel.create(data).then((res)=>{
        console.log("Dev 1684837676 "+ res)
        userPlayerRes = Currency.Parse(res);
    }).catch((e)=>{
        console.log("Dev 1684837715 "+ e)
    })
    return userPlayerRes;
}

export async function FindCurrencyByIdUserPlayer(idUserPlayer: Types.ObjectId) {
    var userPlayerRes;
    await CurrencyModel.findOne({IdUserPlayer : idUserPlayer}).then((res)=>{
        userPlayerRes = Currency.Parse(res);
    })
    return userPlayerRes;
}

export async function UpdateCurrency(currency : ICurrency, idUserPlayer : Types.ObjectId){
    CurrencyModel.updateOne({IdUserPlayer : idUserPlayer}, 
        {
            Diamond : currency.Diamond,
            Money : currency.Money,
            Food : currency.Food,
            Gold : currency.Gold,
            Silver : currency.Silver,
            EnchanceStone : currency.EnchanceStone,
        }
    ).then(res=>{
        console.log("Dev 1684851978 " + JSON.stringify(res))
    })
}

export async function IncreaseNumber(nameCurrency : string, number : number, idUserPlayer : Types.ObjectId) {
    CurrencyModel.updateOne({IdUserPlayer : idUserPlayer}, {$inc:{[nameCurrency] : number}}).then(respone=>{
        console.log("Dev 1686733379 ",respone);
    })
}