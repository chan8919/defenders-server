import { Request, Response, NextFunction } from 'express';

export class ErrorMiddleware {
    // 404 에러 처리
    static notFound(req: Request, res: Response, next: NextFunction) {
        const error = new Error(`Not Found - ${req.originalUrl}`);
        res.status(404);
        next(error);
    }

    // 에러 핸들러
    static errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        
        res.status(statusCode);
        res.json({
            success: false,
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack
        });
    }
} 