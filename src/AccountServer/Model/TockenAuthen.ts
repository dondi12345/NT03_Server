export interface ITockenAuthen{
    Token : String,
    IdDevice : String,
}

export class TockenAuthen implements ITockenAuthen{
    Token : String;
    IdDevice : String;

    constructor() {
        
    }

    static Parse(data) : ITockenAuthen{
        try{
            data = JSON.parse(data);
        }catch(err){}
        return data;
    }
}