export class DataModel{
    static Parse<T>(data) : T{
        try{
            data = JSON.parse(data);
        }catch(err){}
        return data;
    }
}