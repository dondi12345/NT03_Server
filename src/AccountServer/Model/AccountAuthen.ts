export interface IAccountAuthen{
    Username: String,
    Password: String,
    IdDevice: String,
}

export class AccountAuthen implements IAccountAuthen{
    Username: String;
    Password: String;
    IdDevice: String;

    constructor() {
        
    }

    static Parse(data) : IAccountAuthen{
        try{
            data = JSON.parse(data);
        }catch(err){}
        return data;
    }
}