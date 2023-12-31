import { Request , Response , NextFunction } from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { IRegistration } from '../dto/usersRegistration.dto';
import { AUTH_SECRET_KEY } from '../config';


export const generateSalt = async()=>{
   return  await bcrypt.genSalt();
}
export const hashPass = async (password:string , salt:string) =>{
    return  await bcrypt.hash(password , salt)
}


export const usersAuth = async (userRegisterData : IRegistration) =>{
      const authResponse =  await jwt.sign(userRegisterData ,AUTH_SECRET_KEY, {expiresIn:"1d"})
      return authResponse ; 
}

export const verifyUserAuth = async (req:Request)=>{
     const token:string  = req.get("Authorization") as string;

       const verifiedToken = await jwt.verify(token?.split(' ')[1] ,AUTH_SECRET_KEY) as IRegistration
       if(verifiedToken){
             req.user = verifiedToken ; 
            return true ;
       }
}



