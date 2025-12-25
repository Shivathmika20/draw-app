import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-auth/config';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const token = req.headers.authorization;
        if(!token){
            return res.status(401).json({message:'Unauthorized: No token provided'});
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (!decoded || typeof decoded === 'string' || !decoded.userId) {
            return res.status(403).json({ message: 'Unauthorized: Invalid token payload' });
        }
        (req as any).userId = decoded.userId;
        next();
    } catch (error) {
        // Handle JWT errors (expired, invalid signature, etc.)
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ message: 'Unauthorized: Invalid token' });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(403).json({ message: 'Unauthorized: Token expired' });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};