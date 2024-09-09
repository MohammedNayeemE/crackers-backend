import dotenv from 'dotenv';
dotenv.config();
import express, { Request , Response ,  NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Admin } from '../queries';
import { pool } from '../config/config';
import { TOKEN_EXPIRY } from '../constant';
const adminSignUp = async (req : Request , res : Response , next : NextFunction) =>{

    const client = await pool.connect();
    const {admin_email , admin_pass} = req.body;
    const hash  = await bcrypt.hash(admin_pass , 10);
    try{
        const results = await client.query(Admin.addAdmin , [admin_email , hash]);
        if(!results) {
            return res.status(500).json({statusCode : 500 , err : "cant post"});
        }
        else{
            return res.status(200).json({statusCode : 200 , msg : "Admin Created Successfully"});
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
   const {admin_email , admin_pass} = req.body;
   const client = await pool.connect();
   try{
        const {rows , rowCount} = await client.query(Admin.signIn , [admin_email  ]);
        if(rowCount === 0){ return res.status(404).json({statusCode: 404  , msg : "user not found with this email"}); }
        const _p = rows[0].admin_password;
        const degen = await bcrypt.compare(admin_pass , _p);
        if(!degen) { return res.status(403).json({statusCode : 403 , msg : "invalid password please try again"}); }
        const token = jwt.sign({admin : rows[0]} , process.env.JWT_SECRET || '');
        res.cookie("access_token" , token , {httpOnly : true , maxAge :TOKEN_EXPIRY });
        
        return res.status(201).json({ statusCode : 201 , _cookie : res.cookie , msg : 'user logged in' });
        
   }
   catch(err){
        return res.status(500).json({statusCode : 500 , err : "INTERNAL SERVER ERROR"});
   }
   finally{
    client.release();
   }

}

const getOrderStatus = async (req : Request , res : Response) =>{
    const {ck} = req.params;
    const client = await pool.connect();
    try{
        let data;
        if(ck === "true"){  data = await client.query(Admin.get_complete);  }
        else  {  data = await client.query(Admin.get_pending);   }  
        
        if(!data) return res.status(404).json({statusCode : 404 , err : "no data found here"});

        return res.status(201).json({statusCode : 201 , data : data.rows});
    }
    catch(err){
        return res.status(500).json({statusCode : 500 , err : "Internal server error"});
    }
    finally{
        client.release();
    }
}
const getItems = async (req : Request , res : Response) =>{
    const {c_id} = req.params;
    const client = await pool.connect();
    try{
        const {rows , rowCount} = await client.query(Admin.get_items , [c_id]);
        if(rowCount === 0) return res.status(404).json({statusCode : '404' , err : 'no data here check other places'});
        return res.status(201).json({statusCode : 201 , data : rows});
    }
    catch(err){
        return res.status(500).json({statusCode : 500 , msg : "Internal server error" , err : err});
    } 
    finally{
        client.release();
    }
}
const get_categories = async (req : Request , res : Response) =>{
    const client = await pool.connect();
    try{
        const {rows , rowCount} = await client.query(Admin.get_categories);
        if(rowCount === 0) return res.status(404).json({statusCode : '404' , err : 'no data here check other places'});
        return res.status(201).json({statusCode : 201 , data : rows});
    }
    catch(err){
        return res.status(500).json({statusCode : 500 , err : "Internal server error"});
    }
    finally{
        client.release();
    }
}
const update_items = async (req : Request , res : Response) =>{
    const client = await pool.connect();
    try{

        const {item_id , item_name , item_price , item_image , item_stock , item_description , category_id} = req.body;
        const values = [ 
            item_name || null ,
            item_price !== undefined ? item_price : null ,
            item_image || null ,
            item_stock !== undefined ? item_stock : null ,
            item_description || null ,
            category_id !== undefined ? category_id : null ,
            item_id
         ]
         const {rows , rowCount} = await client.query(Admin.update_items , values);
         if(rowCount === 0) return res.status(404).json({statusCode : 404 , msg : "cant find the existing item to upgrade"});
         return res.status(200).json({statusCode : 200 , msg : "updated successfully" , data : rows});
    }
    catch(err){
        return res.status(500).json({statusCode : 500 , msg : "Internal server error" , err : err});
    }
    finally{
        client.release();
    }
}
const add_item = async (req : Request , res : Response) =>{
    const client = await pool.connect();
    try{
        const {item_name , item_price , item_image , item_stock , item_description , category_id} = req.body;
        const {rows , rowCount} = await client.query(Admin.add_item , [item_name , item_price , item_image , item_stock , item_description , category_id]);
        if(rowCount === 0) return res.status(404).json({statusCode : 404 , msg : "you are a fucking dumbass"});
        return res.status(200).json({statusCode : 200 , msg  : "items added"});
    }
    catch(err){
        return res.status(500).json({statusCode : 500 , msg : "INTERNAL SERVER ERROR" , err : err});
    }
    finally{
        client.release();
    }
}
const add_category = async (req : Request , res : Response) =>{
    const client = await pool.connect();
    const {name} = req.body;
    try{
        const {rows , rowCount} = await client.query(Admin.add_category,[name]);
        if(rowCount === 0) return res.status(404).json({statusCode : 404 , msg : "you are a fucking dumbass"});
        return res.status(200).json({statusCode : 200 , msg  : "category added"});
    }
    catch(err){
        return res.status(500).json({statusCode : 500 , msg : "INTERNAL SERVER ERROR" , err : err});
    }
    finally{
        client.release();
    }
}

const update_order_status = async (req : Request , res : Response) =>{
    const client = await pool.connect();
    const {order_id} = req.body;
    try{
        const {rows , rowCount} = await client.query(Admin.update_order_status , [order_id]);
        if(rowCount === 0) return res.status(404).json({statusCode : 404 , msg : "no data to update"});
        return res.status(200).json({statusCode : 200 , msg : "updated successfully" , data : rows});
    }
    catch(err){
        return res.status(500).json({statusCode : 500 , msg : "INTERNAL SERVER ERROR" , err : err});
    }
    finally{
        client.release();
    }
}
const get_user_details = async (req : Request , res : Response) =>{
    const client = await pool.connect();
    const {ud_id} = req.params;
    try{
        const {rows , rowCount} = await client.query(Admin.get_user_details , [ud_id]);
        if(rowCount === 0) return res.status(404).json({statusCode : 404 , msg : "no user found"});
        return res.status(200).json({statusCode : 200 , data : rows});
    }
    catch(err){
        return res.status(500).json({statusCode : 500 , msg : "INTERNAL SERVER ERROR" , err : err});
    }
    finally{
        client.release();
    }
}


const MODULE = {adminSignIn , adminSignUp , getOrderStatus , getItems , get_categories ,update_items , add_item , add_category , update_order_status , get_user_details};
export default MODULE;
