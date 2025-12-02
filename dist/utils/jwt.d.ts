import jwt from "jsonwebtoken";
export declare const signToken: (payload: any) => string;
export declare const verifyToken: (token: string) => string | jwt.JwtPayload;
