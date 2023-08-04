import { UserPlayerSocketDictionary } from "../Model/UserPlayer";

export let userPlayerLoginCache: UserPlayerSocketDictionary = {}
class UserPlayerService{
    Init(){
        userPlayerLoginCache = {}
    }
}

export const userPlayerService = new UserPlayerService;