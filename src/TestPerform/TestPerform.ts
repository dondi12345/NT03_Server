import { Socket } from "socket.io";
import { DataVersionModel } from "../DataCenter/Model/DataVersion";
import { Message } from "../MessageServer/Model/Message";
import { redisControler } from "../Service/Database/RedisConnect";
import { MessageCode } from "../MessageServer/Model/MessageCode";
import { TransferData } from "../TransferData";
import { SocketConfig } from "../Enviroment/Env";

class TestPerform{
    dataMonster;

    async Init(){
        var data
        await DataVersionModel.find(
            {
                Name : "DataMonster"
            }
        ).then(res=>{
            data = res;
        })
        this.dataMonster = data;
        console.log("TestPerform Inited")
    }

    constructor(){
        this.Init()
    }

    async ReadDB(){
        var data;
        for (let index = 0; index < 100; index++) {
            await DataVersionModel.find(
                {
                    Name : "DataMonster"
                }
            ).then(res=>{
                data = {
                    Index : index,
                    Data: JSON.stringify(res),
                }
            })
        }
        return data;
    }

    async ReadRedis(){
        var data
        for (let index = 0; index < 100; index++) {
            data={
                Index : index,
                Data : await redisControler.Get("NT03:DataCenter:DataMonster"),
            }
        }
        return data
    }

    ReadVar(){
        var data
        for (let index = 0; index < 100; index++) {
            data={
                Index : index,
                Data : JSON.stringify(this.dataMonster),
            }
        }
        return data
    }

    async Router(message:Message, socket:Socket){
        if(message.MessageCode == MessageCode.Server_ReadBD){
            var data = await this.ReadDB();
            socket.emit(SocketConfig.Listening, JSON.stringify(data))
            return;
        }
        if(message.MessageCode == MessageCode.Server_ReadRedis){
            var data = await this.ReadRedis();
            socket.emit(SocketConfig.Listening, JSON.stringify(data))
            return;
        }
        if(message.MessageCode == MessageCode.Server_ReadVar){
            var data = await this.ReadVar();
            socket.emit(SocketConfig.Listening, JSON.stringify(data))
            return;
        }
        TransferData
    }   
}

export const testPerform = new TestPerform();