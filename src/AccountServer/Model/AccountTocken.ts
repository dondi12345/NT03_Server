export interface IAccountTocken{
    Token : String,
    IdDevice : String,
    IdAccount : String,
}

export class AccountTocken implements IAccountTocken{
    Token : String;
    IdDevice : String;
    IdAccount : String;

    constructor() {
        
    }

    static Parse(data) : IAccountTocken{
        try{
            data = JSON.parse(data);
        }catch(err){}
        return data;
    }
}