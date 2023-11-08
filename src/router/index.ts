import express, { Express, Request, Response , NextFunction } from 'express';
import { userOnboarding ,  homePage } from '../controllers';

const router = express.Router()
router.route('/').get(homePage)
router.route("/useronboarding").post(userOnboarding)

export default router ; 
