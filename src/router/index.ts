import express, { Express, Request, Response , NextFunction } from 'express';
import { usersUnboarding } from '../controllers';

const router = express.Router()

router.get("/", usersUnboarding)

export default router
