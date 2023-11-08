import { Request, Response , NextFunction } from 'express';
import { IRegistration } from '../dto/usersRegistration.dto';
import { generateSalt } from '../utilities/useHook';
import prisma from '../model/prismaClient/client';


export const homePage = (req:Request , res:Response)=>{
    res.json({message:"running successfully"})
}




export const userOnboarding = async (req:Request , res:Response)=>{
     console.log(req.body)
    try{
    const salt = await generateSalt();
    const {email ,firstname , lastname , password , company} =  <IRegistration>req.body;
    await prisma.user?.create({
         data :{
             email:email,
             firstname:firstname,
             lastname:lastname,
             password:password,
             company:company,
             salt:salt,
             authToken:""
         }
     })
     res.json({status:true , email , firstname , lastname , password , company , salt})

}catch{
 res.json({message: "error occured"})

}
 
}

export const userLogin = async (req:Request , res:Response , next:NextFunction)=>{
     
 


}


