import express , {Router} from 'express';
import { router_module } from '../lib/util';
import { validateAdmin } from '../validator/validate';
import { AdminController } from '../controllers';
const router:Router = express.Router();


const BASE_ROUTE : string = '/admin';

router.post('/signin' , validateAdmin , AdminController.adminSignIn);
router.post('/signup' , validateAdmin , AdminController.adminSignUp);
router.get('/get-orders/:ck' , AdminController.getOrderStatus);
router.get('/get-items/:c_id' , AdminController.getItems);
router.get('/get-categories' , AdminController.get_categories);
router.post('/add-items'  , AdminController.add_item); 
router.post('/add-category' , AdminController.add_category);

router.put('/update-items/:item_id' , AdminController.update_items);


const MODULE : router_module = {
    BASE_ROUTE ,
    router
}

export default MODULE;