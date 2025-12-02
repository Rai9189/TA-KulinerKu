import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare const checkRole: (roles: Array<"admin" | "user" | "guest">) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const requireUser: () => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
export declare const requireAdmin: () => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
