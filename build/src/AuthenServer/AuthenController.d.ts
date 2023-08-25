import jwt from 'jsonwebtoken';
export declare function AuthenGetToken(data: any): string;
export declare function AuthenVerify(token: any): string | jwt.JwtPayload | null;
