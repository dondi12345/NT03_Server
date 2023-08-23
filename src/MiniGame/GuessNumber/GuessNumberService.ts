import { listen } from "@colyseus/tools";
import { portConfig } from "../../Enviroment/Env";
import { configGuessNumber } from "./ConfigGuessNumber";

export const guessNumberService = listen(configGuessNumber, portConfig.portGuessNumber);
