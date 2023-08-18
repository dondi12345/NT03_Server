import { Message } from "../../MessageServer/Model/Message";
import { MessageCode } from "../../MessageServer/Model/MessageCode";
import { TransferData } from "../../TransferData";
import { tdWaveController } from "../Controller/TDWaveController";

class TDWaveRouter{
    Router(message : Message, transferData : TransferData){
        if(message.MessageCode == MessageCode.TDWave_ProtectedSuccess){
            tdWaveController.ProtectedSuccessCtrl(message, transferData)
            return;
        }
        if(message.MessageCode == MessageCode.TDWave_ProtectedFail){
            tdWaveController.ProtectedFailCtrl(message, transferData);
            return;
        }
    }
}

export const tdWaveRouter = new TDWaveRouter();