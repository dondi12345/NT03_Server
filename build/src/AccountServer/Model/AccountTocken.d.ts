export interface IAccountTocken {
    IdAccount: String;
    Token: String;
}
export declare class AccountTocken implements IAccountTocken {
    IdAccount: String;
    Token: String;
    constructor();
    static Parse(data: any): IAccountTocken;
}
