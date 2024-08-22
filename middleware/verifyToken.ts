import dotenv from 'dotenv';
dotenv.config();
import {Request , Response , NextFunction } from 'express';
import jwt from 'jsonwebtoken';
export const verifyToken = (req : Request , res : Response ,next : NextFunction) =>{
    const token = req.cookies['access_token'];
    if(!token){
        return res.status(401).json({
            statusCode : 401 , 
            err : 'Unauthorised'
        });
    }
    try{
    const decoded = jwt.verify(token , process.env.JWT_SECRET || ''); 
    console.log(decoded);
    next();
        
    }
    catch(err){
        return res.status(403).json({
            statusCode : 403 , 
            err : 'Invalid Token'
        });
    }
}