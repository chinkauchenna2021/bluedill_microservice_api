import { Request, Response, NextFunction, response } from "express";
import {
  IRegistration,
  ILogin,
  IDocument,
  IUsersChat,
  ICollaboration,
  IDocUpdate,
} from "../dto/usersRegistration.dto";

import { config } from "dotenv";
config();

import {
  generateSalt,
  getAbsolutePath,
  getChatNotifier,
  getDecryptFile,
  getEncryptFile,
  getFileFromPath,
  getFileName,
  getFolderPath,
  hashPass,
  removeFile,
  searchFileInFolder,
  usersAuth,
} from "../utilities/useHook";
import prisma from "../model/prismaClient/client";
import { ClassValidation } from "../dto/ClassValidation";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import multer from "multer";
import { connect } from "http2";
// import { convertWordFiles } from 'convert-multiple-files';
import path from "path";
import fs from "fs/promises";

import { callbackPromise } from "nodemailer/lib/shared";
import ConvertAPI from "convertapi";
import { string } from "zod";




const convertapi = new ConvertAPI("r0ps82oFwtrDLyGO", {
  conversionTimeout: 60,
});

import Cryptify from "cryptify";

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

    const { sendersEmail, receiversemail, message } = <IUsersChat>req.body;
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
          senderUserId: senderData?.id as string,
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

export const createCollaboration = async (req: Request, res: Response) => {
  const { docId, docName, roomId } = req.body;

  console.log(req.body);
  try {
    const collab = await prisma.collaborateDocs.findFirst({
      where: {
        roomId: roomId,
        docid: docId,
      },
    });

    if (collab == null) {
      const collabCreated = await prisma.collaborateDocs.create({
        data: {
          docid: docId,
          docname: docName,
          roomId: roomId,
          requestingSignature: false,
        },
      });
      res.json({
        response: "Document Collaboration created",
        status: true,
        message: collabCreated,
      });
    } else {
      res.json({
        response:
          "Document Collaboration creation failed. Collaboration already exist",
        status: false,
      });
    }
  } catch (err) {
    res.json({ response: "server Error occured", status: false, error: err });
  }
};

export const addCollaborators = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // add collaborators

    const { roomId, collabUsersEmail } = req.body;

    const isCollaboratorsAvailable = await prisma.collaborateDocs.findFirst({
      where: { roomId: roomId },
      select: {
        collaborator: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (
      isCollaboratorsAvailable &&
      isCollaboratorsAvailable.collaborator.length <= 0
    ) {
      const mainDoc = await prisma.collaborateDocs.findFirst({
        where: {
          roomId: roomId,
        },
      });

      if (mainDoc) {
        const joinCollaborators = await prisma.collaborator.create({
          data: {
            userId: mainDoc?.id,
            collaboratorEmail: collabUsersEmail,
            isSigned: false,
          },
        });
        res.json({
          collaboratingDocsDetails: mainDoc,
          collaboratordetails: joinCollaborators,
          status: true,
          message: "User is added to Doc Collaboration",
        });
      } else {
        res.json({
          collaboratingDocsDetails: mainDoc,
          message: "No such Document to collaborate.",
        });
      }
    } else {
      res.json({ response: "User is already a collaborator.", status: false });
    }
  } catch (err) {
    res.json({ response: "server Error occured", status: false, error: err });
  }
};

export const getCollaboratorDocs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { roomId } = req.body;

    const collabDocs = await prisma.collaborateDocs.findMany({
      where: {
        roomId: roomId,
      },
      include: {
        collaborator: true,
      },
    });
    if (!(collabDocs.length <= 0)) {
      res.json({
        response: collabDocs,
        status: true,
        message: "Collaboration Document found",
      });
    } else {
      res.json({ message: "Collaboration Document Not found", status: false });
    }
  } catch (err) {
    res.json({ response: "server Error occured", status: false, error: err });
  }
};

export const getChatMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sendersEmail, recieversEmail } = req.body;
  // const { id } = req.user;
  try {
    const receiverData = await prisma.user.findFirst({
      where: { email: recieversEmail },
    });

    const senderData = await prisma.user.findFirst({
      where: { email: sendersEmail },
    });

    if (receiverData?.id != null && senderData?.id != null) {
      const sentMessages = await prisma.chat.findMany({
        where: {
          userEmail: sendersEmail,
          receiverUserId: receiverData?.id,
        },
      });

      const receiversMessages = await prisma.chat.findMany({
        where: {
          userEmail: recieversEmail,
          receiverUserId: senderData?.id,
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
    const { email } = req.body;
    const usersLoginResponseByEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (usersLoginResponseByEmail) {
      const tokenAuth = await usersAuth(
        usersLoginResponseByEmail as IRegistration
      );
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

export const getChatNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { receiverUserId } = req.body;
  // const { id } = req.user;
  try {
    const receiverData = await prisma.chat.findMany({
      where: { receiverUserId: receiverUserId, isReceivedStatus: false },
    });

    if (receiverData.length != 0) {
      let userNotify = await getChatNotifier(receiverData);
      res.json({
        response: userNotify,
        message: "users notification",
      });
    } else {
      res.json({
        response: [],
        message: "No Notification for User",
      });
    }
  } catch {
    res.json({ response: "server issue occured", status: false });
  }
};

export const updateChatNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { chatId } = req.body;
  // const { id } = req.user;
  try {
    const receiverData = await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        isReceivedStatus: true,
      },
    });

    if (receiverData?.id != null) {
      res.json({
        response: receiverData,
        message: `users notification with id ${receiverData.id} was updated successfully `,
      });
    } else {
      res.json({
        response: false,
        message: `users notification with id ${chatId} failed`,
      });
    }
  } catch {
    res.json({ response: "server issue occured", status: false });
  }
};

export const updateDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      docid,
      docname,
      doclink,
      userUpdateDoc,
      templateType,
      isEncrypted,
      securityCode,
      docformat,
    } = req.body;

    const docData = await prisma.document.update({
      where: {
        docid: docid,
      },
      data: {
        docname: docname,
        doclink: doclink,
        userUpdateDoc: userUpdateDoc,
        templateType: templateType,
        isEncrypted: isEncrypted,
        securityCode: securityCode,
        docformat: docformat,
      },
    });

    if (docData.docid != null) {
      res.json({
        response: docData,
        message: `Document with id ${docData.id} was updated successfully `,
      });
    } else {
      res.json({
        response: docData,
        message: `Document update failed `,
      });
    }
  } catch (err) {
    res.json({ response: "server issue occured", status: false });
  }
};

export const getAllDocument = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allDocs = await prisma.document.findMany();
    if (allDocs.length != 0) {
      res.json({
        response: allDocs,
        message: `All templates collected successfully `,
      });
    } else {
      res.json({
        response: allDocs,
        message: `Template Collection failed `,
      });
    }
  } catch (err) {
    res.json({ response: "server issue occured", status: false });
  }
};

export const fileConverter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { convertFormat } = req.body;
    const fileupload = req.file as unknown as Express.Multer.File;
    const filename = fileupload.filename as string;
    const filenameWithoutExt = getFileName(filename);
    const fileLink = getAbsolutePath(
      "../..",
      "src",
      "convertedFiles",
      filename
    );
    const outputPath = getAbsolutePath(
      "../..",
      "src",
      "convertedFiles/fileConversionOutput",
      filenameWithoutExt + "." + convertFormat
    );

    const result = await convertapi
      .convert(convertFormat, { File: fileLink })
      .then(function (result) {
        // get converted file url
        console.log("Converted file url: " + result.file.url);
        res.json({
          response_local_url: fileLink,
          onlineSavedFile: result.file.url,
          message: "file converted successfully",
          status: true,
        });

        return result.file.save(outputPath);
      })
      .then(function (file) {
        console.log("File saved: " + file);
      })
      .catch(function (e) {
        res.json({ message: "error occured during file conversion" });
      });
  } catch (err) {
    res.json({ message: "server error occured", status: false, error: err });
  }
};

export const encryptFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {password} =  req.body;
    if (password !== null) {
      const fileupload = req.file as unknown as Express.Multer.File;
      const filename = fileupload.filename as string;
      const fileLink = getAbsolutePath("../..", "src", "encrypt", filename);
      const outputPath = getAbsolutePath(
        "../..",
        "src",
        "encrypt/encryptOutput",
        "encoded-" + filename
      );
      const cryptifyResponse = new Cryptify(fileLink, password);
      cryptifyResponse
        .encrypt()
        .then((files) => {
          /* Do stuff */
          if (files == undefined) return;
          fs.writeFile(outputPath, files[0]);
          removeFile(fileLink);
          res.json({
            response: outputPath,
            status: true,
            password: password,
            message: "file successfully encrypted",
          });
        })
        .catch((e) =>
          res.json({ response: e, status: false, message: "encryption failed" })
        );
    } else {
      res.json({ status: false, message: "Password is missing" });
    }
  } catch (err) {
    res.json({ message: "server error occured", status: false, error: err });
  }
};

export const decryptFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { decryptFileName , password  } = req.body;
    // const password = "okayChinka4@2021";

    const fileLink = getAbsolutePath(
      "../..",
      "src",
      "encrypt/encryptOutput",
      decryptFileName
    );

    let fileName = getFileName(decryptFileName);
    let ext = path.extname(decryptFileName);
    let fileNameWithoutEncode = fileName.split("-").splice(1, 3).join("-");

    const getFolderPaths = getFolderPath(
      "../..",
      "src",
      "encrypt/encryptOutput"
    );
    const folderFiles = await fs.readdir(getFolderPaths);
    const isFileFound = folderFiles.includes(decryptFileName);

    const realFileName = fileNameWithoutEncode + ext;
    const outputPath = getAbsolutePath("../..", "src", "encrypt", realFileName);
    
    if (isFileFound) {

      console.log(fileLink , folderFiles)
      const instancess = new Cryptify(fileLink,password);
      instancess.decrypt().then((files) => {
          /* Do stuff */
          console.log( "file is ready " , outputPath);
          if(files == undefined) return ; 
          fs.writeFile(outputPath , files[0])
          removeFile(fileLink);
           res.json({response:outputPath , status:true ,password:password , message:"file successfully decrypted"})
        }).catch((e) =>
          res.json({ response: e, status: false, message: "decryption failed" })
        );
    } else {
      res.json({ message: "decrypting file does not exist ", status: true });
    }
  } catch (err) {
    res.json({ message: "server error occured", status: false, error: err });
  }
};

// Password Requirements:
// 1. Must contain at least 8 characters
// 2. Must contain at least 1 special character
// 3. Must contain at least 1 numeric character
// 4. Must contain a combination of uppercase and lowercase
