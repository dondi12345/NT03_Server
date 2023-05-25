export interface IAccountTocken{
    IdAccount: String,
    Token : String,
}

export class AccountTocken implements IAccountTocken{
    IdAccount: String;
    Token : String;

    constructor() {
        
    }

    static Parse(data) : IAccountTocken{
        try{
            data = JSON.parse(data);
        }catch(err){}
        return data;
    }
}