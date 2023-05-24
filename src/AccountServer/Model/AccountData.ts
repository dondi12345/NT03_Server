import mongoose, { Schema, Types } from 'mongoose';

export interface IAccountData{
    IdAccount : String,
    IdDevice : String,
}

export class AccountData implements IAccountData{
    IdAccount : String;
    IdDevice : String;

    constructor() {
        
    }

    static Parse(data) : IAccountData{
        try{
            data = JSON.parse(data);
        }catch(err){}
        return data;
    }
}