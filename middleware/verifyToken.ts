import dotenv from 'dotenv';
dotenv.config();
import {Request , Response , NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyToken = async ( req : Request , res : Response , next : NextFunction) =>{
    const token = req.cookies['access_token'];
    if(!token) return res.status(401).json({statusCode : 401 , err : 'unauthorised'});
    try{
        const decode = jwt.verify(token , process.env.JWT_SECRET || '');
        req.body.admin = decode;
    }
    catch(err){
        return res.status(403).json({statusCode : 403 , msg : 'forbidden' , err : err});
    }
    next();

}
