import { Request , Response , NextFunction } from 'express';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { IRegistration , IChatNotifier } from '../dto/usersRegistration.dto';
import { AUTH_SECRET_KEY } from '../config';
import path from 'path';
import fs from 'fs'

import crypto from 'crypto'





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


export const getChatNotifier = async (usersChatData: IChatNotifier[]) =>{
    return usersChatData.filter((usersChat:IChatNotifier)=>usersChat?.isReceivedStatus == false)
}



export const getAbsolutePath = (LinkPathDots:string , parentFolder:string ,  folderName:string , fileName:string) =>{
  
  return path.join(path.resolve(__dirname,LinkPathDots,parentFolder,folderName) ,fileName)
}

export const getFolderPath = (LinkPathDots:string , parentFolder:string , folderName:string ) =>{
    return path.resolve(__dirname,LinkPathDots,parentFolder,folderName)

}



export const getFileName = (filenameWithExtension:string)=>{
    return  path.basename(filenameWithExtension, path.extname(filenameWithExtension));
}



export const getEncryptFile = (inputPath:string, outputPath:string, password:string)=>{
       
       try{
           const algorithm = 'aes-256-cbc';
               const salt = "bluedil-xxxxxxx-generate-salt-2024"
               const key = crypto.scryptSync(password, salt , 32);
               const iv = crypto.randomBytes(16);
           
               const cipher = crypto.createCipheriv(algorithm, key, iv);
           
               const input = fs.createReadStream(inputPath);
               const output = fs.createWriteStream(outputPath);
           
               output.write(iv);
           
             const pipeOutput =  input.pipe(cipher).pipe(output);
            return output.path;

       }catch (error){
        console.error('Error encrypting file:', error);
       }
}



export const getDecryptFile = (inputPath:string, outputPath:string, password:string)=>{
     try{

         const algorithm = 'aes-256-cbc';
         const salt = "bluedil-xxxxxxx-generate-salt-2024"
         const key = crypto.scryptSync(password,salt, 32);
                     
     
         const input = fs.createReadStream(inputPath);
         const output = fs.createWriteStream(outputPath);
     
         let iv;
     
        const pipeOutput =  input.once('readable', () => {
             iv = input.read(16);
             const decipher = crypto.createDecipheriv(algorithm, key, iv);
     
             input.pipe(decipher).pipe(output);
         });
     
     
     
         return {output}


     }catch (error){
        console.error('Error decrypting file:', error);
     }
   

}


export const removeFile = (filePath:string)  => {
    fs.unlink(filePath, (err) => {
        if (err) {
           
            return `Error removing file: ${err}`;
        }
         return `${filePath} has been removed successfully.`;
    });
}




export const searchFileInFolder = (folderPath:string , fileName:string) =>{
     const arr =    fs.readdir(folderPath, (err, files) => files);
     return arr ; 
}



export const getFileFromPath = (path:string)=> path.split('/')[path.length-1];

export const generateUsersPassword = (length:number)=>{
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}