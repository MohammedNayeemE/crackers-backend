import express from 'express';
import cors from 'cors';
import { Response , Express } from 'express';
import cookieParser from 'cookie-parser';
import { errorHandler } from '../middleware/errorHandler';
import { AdminRoute ,UserRoute  , DeveloperRoute} from '../router';
const app : Express  = express();
const allowedOrigins = "*";
const corsOptions = {
    origin : allowedOrigins ,
    methods : "GET,POST,PUT,PATCH,HEAD,DELETE",
    credentials : true ,
    optionsSuccessStatus : 200

}
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

app.get('/' , (_ , res : Response) =>{
    res.status(200).json({
        statusCode : 200 , msg : 'server is running'});
    });

app.use(AdminRoute.BASE_ROUTE , AdminRoute.router);
app.use(UserRoute.BASE_ROUTE , UserRoute.router);
app.use(DeveloperRoute.BASE_ROUTE , DeveloperRoute.router);
const port  = process.env.PORT || 6969 ;

app.listen(port  , () =>{
    console.log(`[server :)] don't worry everything is fine here`);
    
});
