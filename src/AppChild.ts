// Import necessary modules
import Init from "./Service/Init";
import { InitMessageServer } from "./MessageServer/Init/InitMessageServer";
import { InitChatServer } from "./ChatServer/Service/ChatService";
import { GetIdUserPlayerByIdChatChannel } from "./ChatServer/Model/UserChatChannel";
import { Types } from "mongoose";
import { InitUserPlayerServer } from "./UserPlayerServer/Service/UserPlayerService";
import { InitAccountServer } from "./AccountServer/Service/AccountService";

// Function to create app child instance
export function AppChild() {
    console.log("1684561087 Init AppChild")
    Init.InitDatabase().then(()=>{
        InitAccountServer();
        InitMessageServer();
        InitUserPlayerServer();
        InitChatServer();
    }).catch(err=>{
        console.log(err);
    })
}