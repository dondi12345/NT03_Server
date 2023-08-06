import jwt from 'jsonwebtoken';

const secretKey = 'homnaytroidepqua';

class TockenController{
    AuthenGetToken(data){
        let token = jwt.sign(data, secretKey, { expiresIn: '7d' });
        return token;
    }
    AuthenGetTokenWithKey(data, key){
        let token = jwt.sign(data, key, { expiresIn: '7d' });
        return token;
    }

    AuthenVerify(token){
        try {
          let decoded = jwt.verify(token, secretKey);
          return decoded;
        } catch (error) {
          return null;
        }
    }
    AuthenVerifyWithKey(token, key){
        try {
          let decoded = jwt.verify(token, key);
          return decoded;
        } catch (error) {
          return null;
        }
    }
}

export const tokenController = new TockenController();