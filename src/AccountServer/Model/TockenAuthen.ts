import { PlatformCode } from "../../LogServer/Model/LogModel";

export interface ITockenAuthen{
    Token : String,
    IdDevice : String,
    Platform : PlatformCode,
}

export class TockenAuthen implements ITockenAuthen{
    Token : String;
    IdDevice : String;
    Platform : PlatformCode;

    constructor() {
        
    }

    static Parse(data) : ITockenAuthen{
        try{
            data = JSON.parse(data);
        }catch(err){}
        return data;
    }
}