import express, { Express, Request, Response , NextFunction } from 'express';
import { userOnboarding } from '../controllers';

const router = express.Router()

router.route("/useronboarding").post(userOnboarding)

export default router
