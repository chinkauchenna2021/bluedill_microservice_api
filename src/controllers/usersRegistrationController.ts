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

    if (userReponse) {
      const tokenAuth = await usersAuth({
        email: email,
        firstname: firstname,
        lastname: lastname,
        password: password,
        company: company,
        salt: salt,
        hashpassword: hashpassword,
      });
      res.json({ authToken: tokenAuth, status: true });
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
  const usersResponse = await prisma.user.findFirst({
    where: {
      email: email,
      password: password,
    },
  });

  if (usersResponse) {
    res.json({ response: usersResponse, status: true });
  }

  res.json({ response: "", status: false });
};
