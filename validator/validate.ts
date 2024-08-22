import { Request, Response, NextFunction } from 'express';

export const validateAdmin = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ err: 'Email and password are required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ err: 'Invalid email format.' });
    }
    if (password.length < 8) {
        return res.status(400).json({ err: 'Password must be at least 8 characters long.' });
    }
    next();
};

