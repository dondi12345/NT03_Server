import jwt from 'jsonwebtoken';
import { DataModel } from '../../Utils/DataModel';
import { TokenUserPlayer } from '../Model/TokenUserPlayer';
import { logController } from '../../LogServer/Controller/LogController';
import { LogCode } from '../../LogServer/Model/LogCode';

const secretKey = 'homnaytroidepqua';

class TockenController {
  AuthenGetToken(data) {
    let token = jwt.sign(data, secretKey, { expiresIn: '7d' });
    return token;
  }
  AuthenGetTokenWithKey(data, key) {
    let token = jwt.sign(data, key, { expiresIn: '7d' });
    return token;
  }

  AuthenVerify(token) {
    try {
      let decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      return null;
    }
  }
  AuthenVerifyWithKey(token, key) {
    try {
      let decoded = jwt.verify(token, key);
      return decoded;
    } catch (error) {
      return null;
    }
  }

  AuthenTokenUserPlayer(token) {
    var tokenUserPlayer = DataModel.Parse<TokenUserPlayer>(tokenController.AuthenVerify(token));
    if (tokenUserPlayer == null || tokenUserPlayer == undefined) {
      logController.LogDev("1684937365 wrong token");
      logController.LogWarring(LogCode.UserPlayerServer_AuthenTokenFail, "Token authen fail", token);
      return null;
    }
    return tokenUserPlayer;
  }
}

export const tokenController = new TockenController();