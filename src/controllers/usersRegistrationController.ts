import express, { Express, Request, Response , NextFunction } from 'express';
import { IRegistration } from '../dto/usersRegistration.dto';


export const usersUnboarding =  (req:Request , res:Response ,next:NextFunction)=>{
   const {id , email ,firstname , lastname , password , company} = <IRegistration>req.body;
   
}
