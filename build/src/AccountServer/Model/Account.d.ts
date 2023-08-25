import mongoose, { Types } from 'mongoose';
export declare class AccountLoginData {
    Username: string;
    Password: string;
    IdDevice: string;
}
export declare class AccountRegisterData {
    Username: string;
    Password: string;
}
export interface IAccount {
    _id: Types.ObjectId;
    Username: String;
    Password: String;
}
export declare class Account implements IAccount {
    _id: Types.ObjectId;
    Username: String;
    Password: String;
    constructor();
    static Parse(data: any): IAccount;
}
export declare const AccountModel: mongoose.Model<IAccount, {}, {}, {}, mongoose.Document<unknown, {}, IAccount> & Omit<IAccount & Required<{
    _id: Types.ObjectId;
}>, never>, any>;
export declare function GetAccountById(_id: Types.ObjectId): Promise<any>;
export declare function CreateAccount(account: Account): Promise<any>;
export declare function FindByUserName(username: String): Promise<any>;
export declare function CountAccount(callback: any): Promise<void>;
