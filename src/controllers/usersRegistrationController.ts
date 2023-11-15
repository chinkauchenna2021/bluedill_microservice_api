import { Request, Response, NextFunction } from "express";
import {
  IRegistration,
  ILogin,
  IDocument,
  IUsersChat,
  ICollaboration,
} from "../dto/usersRegistration.dto";
import { generateSalt, hashPass, usersAuth } from "../utilities/useHook";
import prisma from "../model/prismaClient/client";
import { ClassValidation } from "../dto/ClassValidation";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { Multer } from "multer";

export const homePage = (req: Request, res: Response) => {
  res.json({ message: "running successfully" });
};

const MAX_COLLABORATORS = 5;

export const userOnboarding = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    

    // const validatedData = plainToClass(ClassValidation, req.body);
    // const validationResult = await validate(validatedData, {
    //   validationError: { target: true },
    // });

    // if (validationResult.length !== 0) {
    //   return res.status(400).json(validationResult);
    // }

    const { email, firstname, lastname, password, company } =<IRegistration>req.body;
    // const userConfiguration = { email, firstname, lastname, password, company };
    //    const userAuthToken  = await usersAuth(userConfiguration , salt);
    const salt = await generateSalt();
    const hashpassword = await hashPass(password, salt);

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

    if (userReponse.id != undefined) {
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
      },
    });

    if (usersLoginResponse) {
      const tokenAuth = await usersAuth(usersLoginResponse as IRegistration);
      if (tokenAuth) {
        res.json({
          authToken: tokenAuth,
          status: true,
          response: usersLoginResponse,
        });
      }
    }
    res.json({ response: "user not found ", status: false });
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
    res.json({
      message: "user not found",
      status: false,
      user: usersRecoveryData,
    });
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
    res.json({
      message: "user not found",
      status: false,
      user: searchUsersData,
    });
  } catch {
    res.json({ response: "error occured", status: false });
  }
};

export const adminUploadTemplates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { docid, docname, templateType } = <IDocument>req.body;
  const { id } = <IRegistration>req.user;
  const fileupload = req.file as unknown as Express.Multer.File;
  const filename = fileupload.filename as string;

  try {
    let updateTemplate = await prisma.document?.create({
      data: {
        docid: docid,
        docname: docname,
        doclink: filename,
        userUpdateDoc: id as string,
        templateType: templateType,
      },
    });

    if (updateTemplate) {
      res.json({ response: "template added successfully", status: true });
    }

    res.json({ response: "something went wrong", status: false });
  } catch (err) {
    res.json({ response: "server error", status: false });
  }
};

export const getAllTemplates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allDocuments = await prisma.document?.findMany();
    res.json({ response: allDocuments, status: true });
  } catch (err) {
    res.json({ response: "server issue occured", status: false });
  }
};

export const usersChat = async (
  req: Request,
  res: Response,
  nexr: NextFunction
) => {
  const { id, email } = <IRegistration>req.user;

  const { receiversemail, message } = <IUsersChat>req.body;

  try {
    const recieversData = await prisma.user.findFirst({
      where: { email: receiversemail },
    });

    if (recieversData?.id != null) {
      const chatusers = await prisma.chat.create({
        data: {
          userEmail: email,
          userMessage: message,
          senderUserId: id as string,
          receiverUserId: recieversData?.id as string,
          isReceivedStatus: true,
          user: {
            connect: {
              id: recieversData?.id as string,
            },
          },
        },
      });

      if (chatusers.id != null) {
        res.json({
          response: `message sent to user with the id ${recieversData.id}`,
          status: true,
          message: message,
        });
      }
    }

    res.json({ response: "reciever does not exist ", status: false });
  } catch {
    res.json({ response: "server issue occured", status: false });
  }
};

export const getUserMessagesToReceiver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const { id } = req.user;
  try {
    const receiverData = await prisma.user.findFirst({
      where: { email: email },
    });

    if (receiverData?.id != null) {
      const usersAllMessages = await prisma.chat.findMany({
        where: {
          senderUserId: id,
          receiverUserId: receiverData.id,
        },
      });
      res.json({ response: usersAllMessages, status: true });
    }

    res.json({
      response: `no such user with email ${email} exist `,
      status: false,
    });
  } catch {
    res.json({ response: "server issue occured", status: false });
  }
};

export const getReceiversMessagesFromSender = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  try {
    const usersReceivedMessaages = await prisma.chat.findMany({
      where: {
        senderUserId: email,
      },
    });
    res.json({ response: usersReceivedMessaages, status: true });
  } catch {
    res.json({ response: "server issue occured", status: false });
  }
};

export const collaboratingUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user;

  const { docid, docname, roomId, collabUsersEmail } = <ICollaboration>req.body;

  try {
    const getCollaboratingUsers = await prisma.collaboratingUsers.findFirst({
      where: {
        docid: docid,
        roomId: roomId,
      },
      select: {
        collabNumber: true,
      },
    });

    if (
      getCollaboratingUsers !== undefined &&
      getCollaboratingUsers?.collabNumber == 0
    ) {
      const collabData = await prisma.collaboratingUsers.create({
        data: {
          collabNumber: collabUsersEmail?.length,
          docid: docid as string,
          docname: docname as string,
          roomId: roomId,
          collabUsersEmail: collabUsersEmail,
          user: {
            connect: {
              id: id,
            },
          },
        },
      });

      res.json({
        response: collabData,
        status: true,
        message: "collaboration created successfully ",
      });
    } else if (
      getCollaboratingUsers?.collabNumber != undefined &&
      getCollaboratingUsers?.collabNumber > 0 &&
      getCollaboratingUsers?.collabNumber <= MAX_COLLABORATORS
    ) {
      const findUpdate = await prisma.collaboratingUsers.findFirst({
        where: {
          docid: docid,
          roomId: roomId,
        },
      });

      const updatesUsers = await prisma.collaboratingUsers?.update({
        where: {
          id: findUpdate?.id as string,
        },
        data: {
          collabNumber:collabUsersEmail?.length,
          collabUsersEmail: collabUsersEmail,
        },
      });

      res.json({
        response: updatesUsers,
        status: true,
        message: "user email added as doc collaborator",
      });
    }

    res.json({
      message:
        "collaborating users reached maximum.Collaboration for this document is closed",
      status: false,
    });
  } catch {
    res.json({ response: "server issue occured", status: false });
  }
};

export const getRoomCollaborators = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { roomId } = req.body;

  try {
    const roomdata = await prisma.collaboratingUsers.findFirst({
      where: {
        roomId: roomId,
      },
    });

    if (roomdata?.id !== undefined) {
      res.json({ response: roomdata, status: true });
    }
    res.json({
      response: roomdata,
      statu: false,
      message: "no such room found",
    });
  } catch {
    res.json({ response: "server issue occured", status: false });
  }
};
