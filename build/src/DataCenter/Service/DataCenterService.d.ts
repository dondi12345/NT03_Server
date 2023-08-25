declare class DataCenterService {
    constructor();
    Init(): Promise<void>;
    InitData(dataName: string): Promise<any>;
}
export declare const dataCenterService: DataCenterService;
export {};
