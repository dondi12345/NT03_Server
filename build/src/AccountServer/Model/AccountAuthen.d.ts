export interface IAccountAuthen {
    Username: String;
    Password: String;
    IdDevice: String;
}
export declare class AccountAuthen implements IAccountAuthen {
    Username: String;
    Password: String;
    IdDevice: String;
    constructor();
    static Parse(data: any): IAccountAuthen;
}
