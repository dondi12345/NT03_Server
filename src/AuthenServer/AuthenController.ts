import jwt from 'jsonwebtoken';

// Generate a JWT token
const secretKey = 'homnaytroidepqua';

export function AuthenGetToken(data){
    let token = jwt.sign(data, secretKey, { expiresIn: '7d' });
    return token;
}

// Verify a JWT token
export function AuthenVerify(token){
    try {
      let decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      return null;
    }
}