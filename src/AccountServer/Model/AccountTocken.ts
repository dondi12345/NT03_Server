export interface IAccountTocken{
    Token : String,
}

export class AccountTocken implements IAccountTocken{
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