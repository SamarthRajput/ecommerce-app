import { ErrorRequestHandler } from 'express';
import multer from 'multer';

const errorHandler = (err: any, req: any, res: any, next: any) => {
    console.error('❌ Global Error:', err);

    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
    }

    if (err.name === 'ValidationError') {
        return res.status(422).json({ error: err.message });
    }

    return res.status(500).json({ error: err.message || 'Internal Server Error' });
};

export default errorHandler;
