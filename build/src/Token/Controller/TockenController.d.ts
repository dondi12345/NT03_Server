import jwt from 'jsonwebtoken';
import { TokenUserPlayer } from '../Model/TokenUserPlayer';
declare class TockenController {
    AuthenGetToken(data: any): string;
    AuthenGetTokenWithKey(data: any, key: any): string;
    AuthenVerify(token: any): string | jwt.JwtPayload | null;
    AuthenVerifyWithKey(token: any, key: any): string | jwt.JwtPayload | null;
    AuthenTokenUserPlayer(token: any): TokenUserPlayer | null;
}
export declare const tokenController: TockenController;
export {};
