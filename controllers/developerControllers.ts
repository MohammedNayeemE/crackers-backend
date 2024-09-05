import express , {NextFunction, Response} from 'express';
import { pool } from '../config/config';
import { Developer } from '../queries';
const GETALL = async ( req : Request, res :Response  , next : NextFunction) =>{
   const client = await pool.connect();
   
   try{

    const admins = await  client.query(Developer.getAdmins);
    const users  = await client.query(Developer.getUsers);

    if(admins.rowCount === 0){
    return res.status(404).json({statusCode : 404 , msg : "cant get admins sorry 😭" });
    }
    if(users.rowCount === 0){
     return   res.status(404).json({statusCode : 404 , msg : "cant get users sorry 🤡"});
    }

    return res.status(201).json( {statusCode : 201 ,  users : users.rows, admins : admins.rows} );


   }
   catch(err){
        return res.status(500).json({statusCode : 500 , err : "INTENAL SERVER ERROR"});    
   }
   finally{
    client.release();
   }
} 


const MODULE = {GETALL};
export default MODULE;