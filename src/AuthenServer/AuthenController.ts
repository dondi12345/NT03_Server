import jwt from 'jsonwebtoken';

// Generate a JWT token
const userData = { userId: '240799', username: 'nthung' };
const secretKey = 'homnaytroidepqua';

export function GetToken(data){
    let token = jwt.sign(data, secretKey, { expiresIn: '1m' });
    return token;
}

// Verify a JWT token
export function Verify(token){
    try {
      let decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      return null;
    }
}