import express , {Router} from 'express';
import { router_module } from '../lib/util';
import { validateAdmin } from '../validator/validate';
import { AdminController } from '../controllers';
const router:Router = express.Router();


const BASE_ROUTE : string = '/admin';

router.post('/signin' , validateAdmin , AdminController.adminSignIn);
router.post('/signup' , validateAdmin , AdminController.adminSignUp);

router.get('/get-orders-pending');
router.get('/get-orders-complete');
router.get('/get-items/:categoryID');
router.get('/get-categories');


router.post('/add-items'); 
router.post('/add-category');

router.put('/update-items/:itemID');
//router.put('/update-profile/:adminID');


const MODULE : router_module = {
    BASE_ROUTE ,
    router
}

export default MODULE;