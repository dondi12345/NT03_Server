import { listen } from "@colyseus/tools";
import { portConfig } from "../../Enviroment/Env";
import Config from "./Config";

export default listen(Config, portConfig.portGuessNumber);