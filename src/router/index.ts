import express, { Express, Request, Response , NextFunction } from 'express';
import { userOnboarding ,  homePage , userLogin  , userRecoverPassword} from '../controllers';

const router = express.Router()
router.route('/').get(homePage)
router.route("/login").post(userLogin)
router.route("/useronboarding").post(userOnboarding)
router.route("/passwordrecovery").post(userRecoverPassword)

export default router ; 
