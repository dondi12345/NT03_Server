"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const DataModel_1 = require("../../Utils/DataModel");
const LogController_1 = require("../../LogServer/Controller/LogController");
const LogCode_1 = require("../../LogServer/Model/LogCode");
const secretKey = 'homnaytroidepqua';
class TockenController {
    AuthenGetToken(data) {
        let token = jsonwebtoken_1.default.sign(data, secretKey, { expiresIn: '7d' });
        return token;
    }
    AuthenGetTokenWithKey(data, key) {
        let token = jsonwebtoken_1.default.sign(data, key, { expiresIn: '7d' });
        return token;
    }
    AuthenVerify(token) {
        try {
            let decoded = jsonwebtoken_1.default.verify(token, secretKey);
            return decoded;
        }
        catch (error) {
            return null;
        }
    }
    AuthenVerifyWithKey(token, key) {
        try {
            let decoded = jsonwebtoken_1.default.verify(token, key);
            return decoded;
        }
        catch (error) {
            return null;
        }
    }
    AuthenTokenUserPlayer(token) {
        var tokenUserPlayer = DataModel_1.DataModel.Parse(exports.tokenController.AuthenVerify(token));
        if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
            LogController_1.logController.LogDev("1684937365 wrong token");
            LogController_1.logController.LogWarring(LogCode_1.LogCode.UserPlayerServer_AuthenTokenFail, "Token authen fail", token);
            return null;
        }
        return tokenUserPlayer;
    }
}
exports.tokenController = new TockenController();
