export class DataModel{
    static Parse<T>(data) : T{
        try{
            data = JSON.parse(data);
            try {
                if(typeof data == "string"){
                    data = JSON.parse(data);
                }
            } catch (error) {}
        }catch(err){}
        return data;
    }
}