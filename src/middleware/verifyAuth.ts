import exp , {Express , Response , Request , NextFunction} from 'express';
import JWT from 'jsonwebtoken'
import { IRegistration } from '../dto/usersRegistration.dto';
import { verifyUserAuth } from '../utilities/useHook';

declare global{
    namespace Express {
        interface Request{
            user:IRegistration
        }
    }

}

export const verfyAuthToken = async (req:Request , res:Response , next:NextFunction)=>{
       const tokenAuth =  await verifyUserAuth(req);
       if(tokenAuth){
          next()
       }
    res.json({message:"users auth could not be verified"});
}