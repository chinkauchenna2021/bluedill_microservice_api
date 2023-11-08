import { Request, Response, NextFunction } from "express";
import { IRegistration, ILogin } from "../dto/usersRegistration.dto";
import { generateSalt, hashPass, usersAuth } from "../utilities/useHook";
import prisma from "../model/prismaClient/client";

export const homePage = (req: Request, res: Response) => {
  res.json({ message: "running successfully" });
};

export const userOnboarding = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const salt = await generateSalt();
    const { email, firstname, lastname, password, company } = <IRegistration>(
      req.body
    );
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
      res.json({ message:"registration was successful", status: true  , response:userReponse});
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
  try{

    const usersLoginResponse = await prisma.user.findFirst({
        where: {
          email: email,
          password: password,
        },
        select: {
            email: true,
            firstname: true,
            lastname: true,
            password: true,
            company: true,
            salt: true,
            hashpassword: true,
          },
      });
    
      if (usersLoginResponse) {
        const tokenAuth = await usersAuth(usersLoginResponse as IRegistration) ;
         if(tokenAuth){  
             res.json({ authToken: tokenAuth, status: true });
         }
      }
    
      res.json({ response: "", status: false });

  }catch{
    res.json({ response: "error occured", status: false });
 
  }
 
};
