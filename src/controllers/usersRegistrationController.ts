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
  try {
    const { email, firstname, lastname, password, company } = <IRegistration>(
      req.body
    );
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
  // const auth = req.get("Authorization");
  try {
    const { email, password } = <ILogin>req.body;
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
    } else {
      res.json({ response: "user not found ", status: false });
    }
  } catch {
    res.json({ response: "error occured", status: false });
  }
};

export const userRecoverPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = <IRegistration>req.body;
    const usersRecoveryData = await prisma.user?.findFirst({
      where: { email: email },
    });
    if (usersRecoveryData) {
      res.json({
        message: "user is avaliable",
        recoveryData: usersRecoveryData,
        status: true,
      });
    } else {
      res.json({
        message: "user not found",
        status: false,
        user: usersRecoveryData,
      });
    }
  } catch {
    res.json({ response: "error occured", status: false });
  }
};

export const searchUsersByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = <IRegistration>req.body;
    const searchUsersData = await prisma.user?.findFirst({
      where: { email: email },
    });
    if (searchUsersData) {
      res.json({
        message: "user is avaliable",
        recoveryData: searchUsersData,
        status: true,
      });
    } else {
      res.json({
        message: "user not found",
        status: false,
        user: searchUsersData,
      });
    }
  } catch {
    res.json({ response: "error occured", status: false });
  }
};

export const adminUploadTemplates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { docid, docname, templateType } = <IDocument>req.body;
    const { id } = <IRegistration>req.user;
    const fileupload = req.file as unknown as Express.Multer.File;
    const filename = fileupload.filename as string;
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
    } else {
      res.json({ response: "something went wrong", status: false });
    }
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
  try {
    // const { id, email } = <IRegistration>req.user;

    const { sendersEmail , receiversemail, message } = <IUsersChat>req.body;
    const recieversData = await prisma.user.findFirst({
      where: { email: receiversemail },
    });

    const senderData = await prisma.user.findFirst({
      where: { email: sendersEmail },
    });


    if (recieversData?.id != null) {
      const chatusers = await prisma.chat.create({
        data: {
          userEmail: sendersEmail,
          userMessage: message,
          senderUserId: senderData.id as string,
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
    } else {
      res.json({ response: "reciever does not exist ", status: false });
    }
  } catch {
    res.json({ response: "server issue occured", status: false });
  }
};

// export const getUserMessagesToReceiver = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { email } = req.body;
//   const { id } = req.user;
//   try {
//     const receiverData = await prisma.user.findFirst({
//       where: { email: email },
//     });

//     if (receiverData?.id != null) {
//       const usersAllMessages = await prisma.chat.findMany({
//         where: {
//           senderUserId: id,
//           receiverUserId: receiverData.id,
//         },
//       });
//       res.json({ response: usersAllMessages, status: true });
//     } else {
//       res.json({
//         response: `no such user with email ${email} exist `,
//         status: false,
//       });
//     }
//   } catch {
//     res.json({ response: "server issue occured", status: false });
//   }
// };

// export const getReceiversMessagesFromSender = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { email } = req.body;
//     const usersReceivedMessaages = await prisma.chat.findMany({
//       where: {
//         senderUserId: email,
//       },
//     });
//     res.json({ response: usersReceivedMessaages, status: true });
//   } catch {
//     res.json({ response: "server issue occured", status: false });
//   }
// };

export const collaboratingUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user;

    const { docid, docname, roomId, collabUsersEmail } = <ICollaboration>(
      req.body
    );
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
          collabNumber: collabUsersEmail?.length,
          collabUsersEmail: collabUsersEmail,
        },
      });

      res.json({
        response: updatesUsers,
        status: true,
        message: "user email added as doc collaborator",
      });
    } else {
      res.json({
        message:
          "collaborating users reached maximum.Collaboration for this document is closed",
        status: false,
      });
    }
  } catch {
    res.json({ response: "server issue occured", status: false });
  }
};

export const getRoomCollaborators = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { roomId } = req.body;
    const roomdata = await prisma.collaboratingUsers.findFirst({
      where: {
        roomId: roomId,
      },
    });

    if (roomdata?.id !== undefined) {
      res.json({ response: roomdata, status: true });
    } else {
      res.json({
        response: roomdata,
        statu: false,
        message: "no such room found",
      });
    }
  } catch {
    res.json({ response: "server issue occured", status: false });
  }
};




export const getChatMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sendersEmail ,  recieversEmail } = req.body;
  // const { id } = req.user;
  try {
    const receiverData = await prisma.user.findFirst({
      where: { email: recieversEmail },
    });

    const senderData = await prisma.user.findFirst({
      where: { email: sendersEmail },
    });

    if ((receiverData?.id != null) && (senderData?.id != null)) {
      const sentMessages = await prisma.chat.findMany({
        where: { 
          userEmail:sendersEmail,
          receiverUserId: receiverData?.id,
        },
      });

      const receiversMessages = await prisma.chat.findMany({
        where: {
          userEmail: recieversEmail,
          receiverUserId: senderData?.id
        },
      });

      res.json({
        sentMessages: sentMessages,
        recieveMessages: receiversMessages,
        status: true,
      });
    } else {
      res.json({
        response: `no such user with email ${recieversEmail} exist `,
        status: false,
      });
    }
  } catch {
    res.json({ response: "server issue occured", status: false });
  }
};

export const userLoginByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email} = req.body;
    const usersLoginResponseByEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (usersLoginResponseByEmail) {
      const tokenAuth = await usersAuth(usersLoginResponseByEmail as IRegistration);
      if (tokenAuth) {
        res.json({
          authToken: tokenAuth,
          status: true,
          response: usersLoginResponseByEmail,
        });
      }
    } else {
      res.json({ response: "user not found ", status: false });
    }
  } catch {
    res.json({ response: "error occured", status: false });
  }
};