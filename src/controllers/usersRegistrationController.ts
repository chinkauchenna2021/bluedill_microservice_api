import { Request, Response, NextFunction } from "express";
import { IRegistration, ILogin, IDocument } from "../dto/usersRegistration.dto";
import { generateSalt, hashPass, usersAuth } from "../utilities/useHook";
import prisma from "../model/prismaClient/client";
import { ClassValidation } from "../dto/ClassValidation";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Multer } from "multer";



export const homePage = (req: Request, res: Response) => {
  res.json({ message: "running successfully" });
};

export const userOnboarding = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const salt = await generateSalt();

    const validatedData = plainToClass(ClassValidation , req.body)
    const validationResult = await validate(validatedData , {validationError:{target:true}})

if( validationResult.length !== 0 ){
  return res.status(400).json(validationResult);
}

    const { email, firstname, lastname, password, company } = validatedData
    const userConfiguration = { email, firstname, lastname, password, company };
    //    const userAuthToken  = await usersAuth(userConfiguration , salt);
    const genSalt = await generateSalt();
    const hashpassword = await hashPass(password, genSalt);

    const isUserExist = await prisma.user?.findFirst({
      where: { email: email },
    });
    if (isUserExist) {
      res.json({ message: "user already exist", status: false });
    }

    const userReponse = await prisma.user?.create({
      data: {
        email: email,
        firstname: firstname,
        lastname: lastname,
        password: password,
        company: company,
        salt: salt,
        hashpassword: hashpassword,
      },
    });

    if (userReponse) {
      res.json({
        message: "registration was successful",
        status: true,
        response: userReponse,
      });
    }
  } catch {
    res.json({ message: "error occured" });
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <ILogin>req.body;
  // const auth = req.get("Authorization");
  try {
    const usersLoginResponse = await prisma.user.findFirst({
      where: {
        email: email,
        password: password,
      }
    });

    if (usersLoginResponse) {
      const tokenAuth = await usersAuth(usersLoginResponse as IRegistration);
      if (tokenAuth) {
        res.json({ authToken: tokenAuth, status: true  , response:usersLoginResponse});
      }
    }

    res.json({ response: "user login not successful", status: false });
  } catch {
    res.json({ response: "error occured", status: false });
  }
};

export const userRecoverPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = <IRegistration>req.body;
  try {
    const usersRecoveryData = await prisma.user?.findFirst({
      where: { email: email },
    });
    if (usersRecoveryData) {
      res.json({
        message: "user is avaliable",
        recoveryData: usersRecoveryData,
        status: true,
      });
    }
    res.json({ message: "user not found", status: false  , user:usersRecoveryData});
  } catch {
    res.json({ response: "error occured", status: false });
  }
};

export const searchUsersByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = <IRegistration>req.body;
  try {
    const searchUsersData = await prisma.user?.findFirst({
      where: { email: email },
    });
    if (searchUsersData) {
      res.json({
        message: "user is avaliable",
        recoveryData: searchUsersData,
        status: true,
      });
    }
    res.json({ message: "user not found", status: false  , user:searchUsersData});
  } catch {
    res.json({ response: "error occured", status: false });
  }
};


export const adminUploadTemplates = async (req:Request , res:Response , next:NextFunction) =>{

  const {docid , docname , templateType } =  <IDocument>req.body;
  const  {id} =  <IRegistration>req.user ; 
  const fileupload =  req.file as unknown as Express.Multer.File ; 
  const filename = fileupload.filename as string ; 

  try{

    let updateTemplate = await prisma.document?.create({
      data:{
       docid:docid, 
       docname:docname,
       doclink:filename,
       userUpdateDoc:id as string,
       templateType:templateType,
      }
  })
 
  if(updateTemplate){
 
   res.json({response:"template added successfully" , status:true})
  }
 
res.json({response:"something went wrong" , status:false}) 

  }catch(err){
    res.json({response:"server error", status:false})
  }
}


export const getAllTemplates = async(req:Request , res:Response , next:NextFunction)=>{
   try{
     const allDocuments = await prisma.document?.findMany();
       if(allDocuments){

        res.json({response:allDocuments , status:true})
       }
       res.json({response:"no document available" , status : false})
   }catch{
   
     res.json({response:"server issue occured", status:false})
   }
}
