import express , {Router , Response} from 'express';
import { router_module } from '../lib/util';


const BASE_ROUTE : string = '/test';
const router:Router = express.Router();


router.get('/easter-egg' , (_ , res : Response) =>{
    res.send(
        
        `<h1> CONGRAJULATIONS YOU FOUND THE SECRET </h1>
        <h2> HERE IS YOUR PRICE </h2>
        <a href = "https://www.youtube.com/watch?v=xvFZjo5PgG0">click to get price </a>
        `
    );
});


const MODULE : router_module = {
    BASE_ROUTE , 
    router
}

export default MODULE;





/*

DEAR DEVELOPER , 
    You are welcome to this section of the code , 
    you are allowed to showcase your creativity in this route , 
    do whatever you wanna  with this route do even in production , i have no issues with 

                    - AUTHOR -> 6969
*/





