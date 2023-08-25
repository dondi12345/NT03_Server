export interface IAccountData {
    IdAccount: String;
    IdDevice: String;
}
export declare class AccountData implements IAccountData {
    IdAccount: String;
    IdDevice: String;
    constructor();
    static Parse(data: any): IAccountData;
}
