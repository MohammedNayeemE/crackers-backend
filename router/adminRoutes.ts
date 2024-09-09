import express , {Router} from 'express';
import { router_module } from '../lib/util';
import { validateAdmin } from '../validator/validate';
import { AdminController } from '../controllers';
import { verifyToken } from '../middleware/verifyToken';
const router:Router = express.Router();


const BASE_ROUTE : string = '/admin';

router.post('/signin' , validateAdmin , AdminController.adminSignIn);
router.post('/signup' , validateAdmin , AdminController.adminSignUp);
router.get('/get-orders/:ck' , verifyToken , AdminController.getOrderStatus);
router.get('/get-items/:c_id' , verifyToken ,  AdminController.getItems);
router.get('/get-categories' ,verifyToken ,  AdminController.get_categories);
router.get('/get-user-details/:ud_id' , verifyToken , AdminController.get_user_details);
router.post('/add-items'  , verifyToken ,  AdminController.add_item); 
router.post('/add-category' , verifyToken ,   AdminController.add_category);

router.put('/update-items' , verifyToken ,  AdminController.update_items);
router.put('/update-order-status' , verifyToken , AdminController.update_order_status);

const MODULE : router_module = {
    BASE_ROUTE ,
    router
}

export default MODULE;