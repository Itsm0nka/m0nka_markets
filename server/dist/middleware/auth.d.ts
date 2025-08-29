import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
interface JwtPayloadExtended extends jwt.JwtPayload {
    id: string;
    email: string;
    name: string;
}
export interface AuthenticatedRequest extends Request {
    user?: JwtPayloadExtended;
}
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
