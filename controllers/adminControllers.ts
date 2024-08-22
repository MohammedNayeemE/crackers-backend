import express, { Request , Response ,  NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../queries';
import { pool } from '../config/config';
const adminSignUp = async (req : Request , res : Response , next : NextFunction) =>{

    const client = await pool.connect();
    const {admin_email , admin_pass} = req.body;
    try{
        const results = await client.query(Admin.InsertAdmin , [admin_email , admin_pass]);
        if(!results) {
            return res.status(500).json({statusCode : 500 , err : "INTERNAL SERVER ERROR"});
        }
        else{
            return res.status(200).json({statusCode : 200 , err : "Admin Created Successfully"});
        }
    }
    catch(err){
        return res.status(500).json({statusCode : 500 , err : "INTERNAL SERVER ERROR"});
    }
    finally{
        client.release();        
    }
}

const adminSignIn = async (req : Request , res : Response , next  : NextFunction) =>{
    const client = await pool.connect();
    const {admin_email , admin_pass} = req.body;
    if(!admin_email || !admin_pass) return res.status(404).json({statusCode : 404 , err : "email and password not provided"});

    try{
        const results  = await client.query(Admin.GetAdmin , [admin_email , admin_pass]);
        if(results.rowCount == 0) return res.status(404).json({statusCode : 404 , err : "admin doesn't exist"});
        return res.status(200).json({statusCode : 200 , data : results.rows});
    }
    catch(err){
        return res.status(500).json({statusCode : 500 , err : "INTERNAL SERVER ERROR"});
    }
    finally{
        client.release();        
    }
}

const MODULE = {adminSignIn , adminSignUp};
export default MODULE;
