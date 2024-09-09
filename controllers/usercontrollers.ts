import express, { Request , Response ,  NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/config';
import { User } from '../queries';
import bcrypt from 'bcryptjs';
import { TOKEN_EXPIRY } from '../constant';
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
const signin = async (req : Request , res : Response) =>{
    const client = await pool.connect();
    try{
        const {user_email , user_password} = req.body;
        const {rows , rowCount} = await client.query(User.signin , [user_email]);
        if(rowCount === 0)  { return res.status(404).json({statusCode : 404 , msg : 'user not found '}) };
        //@ts-ignore
        const _p = rows[0].user_password;
        const degen = await bcrypt.compare(user_password , _p);
        if(!degen) return res.status(404).json({statusCode : 404 , msg : 'password not correct'});

        const token = jwt.sign({ user : rows[0] } , process.env.JWT_SECRET || '' );
        res.cookie("user_token" , token , {httpOnly : true , maxAge :TOKEN_EXPIRY });
        return res.status(200).json({statusCode : 200 , msg : 'user logged in' , cookie : res.cookie});
    }
    catch(err){
        return res.status(500).json({statusCode : 500 , msg : 'INTERNAL SERVER ERROR'});
    }
    finally{
        client.release();
    }
}
const get_cart_items = async (req : Request , res : Response) =>{
    const {cart_id} = req.body.user.user;
    if(!cart_id) return res.status(403).json({statusCode : 404, msg : 'forbidden'});
    const client = await pool.connect();

    try{
        const {rows , rowCount} = await client.query(User.get_cart_items , [cart_id]);
        if(rowCount == 0) return res.status(404).json({statusCode : 404 , msg : 'if this msg comes , we are cooked'});
        return res.status(200).json({statusCode : 200 , data : rows});
    }
    catch(err){
        return res.status(500).json({statusCode : 500 , msg : 'INTERNAL SERVER ERROR'});
    }
    finally{
        client.release();
    }

}
const update_cart_items = async (req : Request , res : Response) =>{
    const {cart_id} = req.body.user.user;
    if(!cart_id) return res.status(403).json({statusCode : 404, msg : 'forbidden'});
    const {item_id , quantity} = req.body;
    if(!item_id || !quantity) return res.status(404).json({statusCode : 404 , msg : 'invalid paramters'});
    const client = await pool.connect();

    try{
        const {rows , rowCount} = await client.query(User.update_cart_items , [cart_id , item_id , quantity]);
        if(rowCount == 0) return res.status(404).json({statusCode : '404' , msg : 'again if this comes we are cooked'});
        return res.status(200).json({statusCode : 200 , msg : 'cart-updated'});
    }
    catch(err){
        return res.status(500).json({statusCode : 500 , msg : 'INTERNAL SERVER ERROR' , err : err});
    }
    finally{
        client.release();
    }
}

const MODULE = {signup , signin , get_cart_items , update_cart_items};

export default MODULE;