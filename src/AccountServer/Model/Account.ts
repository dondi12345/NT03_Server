import mongoose, { Schema, Types } from 'mongoose';

export interface IAccount{
    _id : Types.ObjectId;
    Username?: String;
    Password?: String;
}

export class Account implements IAccount{
    _id : Types.ObjectId = new Types.ObjectId();
    Username?: String;
    Password?: String;

    constructor() {
        
    }

    static Parse(data) : IAccount{
        try{
            data = JSON.parse(data);
        }catch(err){}
        return data;
    }
}

const AccountSchema = new Schema<IAccount>(
    {
      _id : { type: Schema.Types.ObjectId, default: new Types.ObjectId()},
      Username :{type : String},
      Password : { type: String}
    }
);
  
export const AccountModel = mongoose.model<IAccount>('Account', AccountSchema);

export async function GetAccountById(_id : Types.ObjectId){
    var Account = new Account();
    await AccountModel.findById(_id).then((res)=>{
        Account = Account.Parse(res);
    }).catch((err)=>{
        console.log(err);
    })
    return Account;
}

export async function CreateAccount(Account:Account) {
    var newAccount
    await AccountModel.create(Account).then(res=>{
        newAccount = res;
    })
    return newAccount
}

export async function FindByUserName(Account : Account){
    var AccountFO;
    await AccountModel.findOne({Username : Account.Username}).then(res=>{
        AccountFO = res;
    })
    return AccountFO;
}