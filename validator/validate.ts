import { Request, Response, NextFunction } from 'express';

export const validateAdmin = (req: Request, res: Response, next: NextFunction) => {
    const { admin_email, admin_pass } = req.body;
    if (!admin_email || !admin_pass) {
        return res.status(400).json({ err: 'Email and password are required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(admin_email)) {
        return res.status(400).json({ err: 'Invalid email format.' });
    }
    if (admin_pass.length < 8) {
        return res.status(400).json({ err: 'Password must be at least 8 characters long.' });
    }
    next();
};

export const validateUser = (req : Request , res : Response , next : NextFunction) =>{
    const {user_email , user_password , user_name , user_phone_number} = req.body;

    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
        errors.push('Invalid email format');
    }
    if (user_password.length < 8) {
        errors.push('Password must be at least 6 characters long');
    }
    if (!/\d/.test(user_password)) {
        errors.push('Password must contain a number');
    }
    if (!/[a-zA-Z]/.test(user_password)) {
        errors.push('Password must contain a letter');
    }
    if (user_name.trim() === '') {
        errors.push('Name is required');
    } else if (!/^[a-zA-Z\s]+$/.test(user_name)) {
        errors.push('Name must contain only letters and spaces');
    }
    // const phoneRegex = /^\+?[1-9]\d{1,14}$/; 
    // if (!phoneRegex.test(user_phone_number)) {
    //     errors.push('Invalid phone number format');
    // }
    if (errors.length > 0) {
        return res.status(400).json({ err : errors });
    }
    next();
}

