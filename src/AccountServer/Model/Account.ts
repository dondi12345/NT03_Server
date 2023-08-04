import mongoose, { Schema, Types } from 'mongoose';
import { LogServer } from '../../LogServer/Controller/LogController';
import { LogCode } from '../../LogServer/Model/LogCode';
import { LogType } from '../../LogServer/Model/LogModel';

export class AccountLoginData{
    Username: string;
    Password: string;
    IdDevice: string;
}
export class AccountRegisterData{
    Username: string;
    Password: string;
}

export interface IAccount{
    _id : Types.ObjectId;
    Username: String;
    Password: String;
}

export class Account implements IAccount{
    _id : Types.ObjectId = new Types.ObjectId();
    Username: String;
    Password: String;

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

export async function CreateAccount(account:Account) {
    var newAccount
    account._id = new Types.ObjectId();
    await AccountModel.create(account).then(res=>{
        newAccount = res;
        LogServer(LogCode.AccountServer_CreateNew, JSON.stringify(res), LogType.Normal);
    }).catch(err=>{
        LogServer(LogCode.AccountServer_CreateFail, err, LogType.Error);
    })
    return newAccount
}

export async function FindByUserName(username : String){
    var account;
    await AccountModel.findOne({Username : username}).then(res=>{
        account = res;
    })
    return account;
}

export async function CountAccount(callback){
    await AccountModel.count({}).then(res=>{
        console.log(res);
        callback(null, res);
    }).catch(err=>{
        callback(err, null);
    })
}