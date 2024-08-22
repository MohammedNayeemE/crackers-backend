import express , {Router} from 'express';
import { router_module } from '../lib/util';
import { verifyToken } from '../middleware/verifyToken';

const router : Router = express.Router();

const BASE_ROUTE : string = '/user';

router.post('/signin');
router.post('/signup');

router.get('/get-items/:categoryID');
router.get('/get-categories');
router.get('/get-cart-items' , verifyToken);
router.get('/get-orders');

router.post('/place-order' , verifyToken);

router.post('/update-cart/:cartID/:itemID');




const MODULE : router_module = {
    BASE_ROUTE ,
    router
}

export default MODULE;
