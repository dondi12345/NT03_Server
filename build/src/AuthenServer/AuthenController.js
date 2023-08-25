"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenVerify = exports.AuthenGetToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Generate a JWT token
const secretKey = 'homnaytroidepqua';
function AuthenGetToken(data) {
    let token = jsonwebtoken_1.default.sign(data, secretKey, { expiresIn: '7d' });
    return token;
}
exports.AuthenGetToken = AuthenGetToken;
// Verify a JWT token
function AuthenVerify(token) {
    try {
        let decoded = jsonwebtoken_1.default.verify(token, secretKey);
        return decoded;
    }
    catch (error) {
        return null;
    }
}
exports.AuthenVerify = AuthenVerify;
