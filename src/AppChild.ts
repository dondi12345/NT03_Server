// Import necessary modules
import Init from "./Service/Init";
import { InitMessageServer } from "./MessageServer/Init/Init";

// Function to create app child instance
export function AppChild() {
    Init.InitDatabase().then(()=>{
        InitMessageServer();
    }).catch(err=>{
        console.log(err);
    })
}