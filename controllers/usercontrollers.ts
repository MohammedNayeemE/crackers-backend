import express, { Request , Response ,  NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/config';
import { User } from '../queries';
import bcrypt from 'bcryptjs';
const signup = async (req : Request , res : Response) =>{
    const client = await pool.connect();
    const {user_email , user_password , user_name , user_phone} = req.body;
    const hash = await bcrypt.hash(user_password , 10);
    try{
        const users = await client.query(User.addUser , [user_email , hash , user_name , user_phone]);
        if(!users){
            return res.status(500).json({statusCode : 500 , err : "SOORY ERROR WHILE POSTING"});
        }
        return res.status(201).json({statusCode : 201 , msg : "user created" , data : users.rows});
    }
    catch(err){
    return res.status(500).json({statusCode : 500 , err : "INTERNAL SERVER ERROR"});
    }
    finally{
        client.release();
    }
}

const MODULE = {signup};

export default MODULE;