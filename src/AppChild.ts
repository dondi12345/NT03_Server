// Import necessary modules
import Init from "./Service/Init";
import { InitMessageServer } from "./MessageServer/Init/InitMessageServer";
import { InitChatServer } from "./ChatServer/Init/InitChatServer";
import { GetIdUserPlayerByIdChatChannel } from "./ChatServer/Model/UserChatChannel";
import { Types } from "mongoose";

// Function to create app child instance
export function AppChild() {
    console.log("1684561087 Init AppChild")
    Init.InitDatabase().then(()=>{
        // InitMessageServer();
        // InitChatServer();
        GetIdUserPlayerByIdChatChannel(new Types.ObjectId("643e14f2d8930cecd1865a60"));
    }).catch(err=>{
        console.log(err);
    })
}