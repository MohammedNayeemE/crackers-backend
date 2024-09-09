import express , {Router} from 'express';
import { router_module } from '../lib/util';
import { UserController } from '../controllers';
import { validateUser } from '../validator/validate';
import { userToken } from '../middleware/userToken';
const router : Router = express.Router();

const BASE_ROUTE : string = '/user';

router.post('/signin' , UserController.signin);
router.post('/signup' , validateUser ,  UserController.signup);
router.get('/get-items/:categoryID');
router.get('/get-categories');
router.get('/get-cart-items' , userToken , UserController.get_cart_items);
// router.get('/get-orders');

router.post('/place-order' , userToken );

router.post('/update-cart' , userToken , UserController.update_cart_items);




const MODULE : router_module = {
    BASE_ROUTE ,
    router
}

export default MODULE;
