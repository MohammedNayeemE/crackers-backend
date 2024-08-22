import express , {Request , Response , NextFunction} from 'express'
export const errorHandler = (error : Error , req : Request , res : Response , next : NextFunction) =>{
    console.error(error);
    res.status(500).json({
        statusCode : 500 , 
        err : 'INTERNAL SERVER ERROR'
    });
    // next();
    
}