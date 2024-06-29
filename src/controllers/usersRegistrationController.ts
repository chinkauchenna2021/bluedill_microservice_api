import { Request, Response, NextFunction, response } from "express";
import {
  IRegistration,
  ILogin,
  INotification,
  IDocument,
  IUsersChat,
  ICollaboration,
  IDocUpdate,
} from "../dto/usersRegistration.dto";

import { config } from "dotenv";
config();

import {
  generateSalt,
  generateUsersPassword,
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
import nodemailer from 'nodemailer';



const convertapi = new ConvertAPI("r0ps82oFwtrDLyGO", {
  conversionTimeout: 60,
});

import Cryptify from "cryptify";
import { sendMailWithNodeMailer } from "../utilities/useNodeMailer";



export const homePage = async (req: Request, res: Response) => {

  res.json({ tile: "Home page", });


};

const MAX_COLLABORATORS = 5;

interface ICollaborators {
  id: string;
  collabId: string;
  collaboratorEmail: string;
  isSigned: boolean;
  createdAt: Date;
  updatedAt: Date;
}


const notification = async (id: string, title: string, userMessage: string) => {
  const notificationDetail = {
    user: id,
    title: title,
    userMessage: userMessage
  }
  const userReponses = await prisma.notification?.create({
    data: {
      user: notificationDetail.user,
      title: notificationDetail.title,
      userMessage: notificationDetail.userMessage,
    },
  });

  return userReponses;

}


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
      return res.json({ message: "user already exist", status: false });
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
      const notification_details = {
        title: "Account Successfully Created",
        message: "Congratulations! Your Bluedill account has been successfully created. Welcome to the Bluedill community!"
      };
      let send_notification = await notification(userReponse.id, notification_details.title, notification_details.message)
      if (send_notification.id != '') {
        return res.json({
          message: "registration was successful",
          status: true
        });
      }
    }
  } catch {
    return res.json({ message: "Error occure", status: false });
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

      const notification_details = {
        title: "Login Successful",
        message: "You have successfully logged into your Bluedill account."
      };
      let send_notification = await notification(usersLoginResponse.id, notification_details.title, notification_details.message)

      if (send_notification.id != '') {
        const tokenAuth = await usersAuth(usersLoginResponse as IRegistration);
        if (tokenAuth) {
          res.json({
            authToken: tokenAuth,
            status: true,
            response: usersLoginResponse,
            statusMessage: "Login Successfull"
          });
        }
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
          isReceivedStatus: false,
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
      where: { roomId: roomId }
    });

    if (
      isCollaboratorsAvailable?.id != undefined
    ) {

      const hasApprovedCollaborators = await prisma.collaborator.findMany({
        where: {
          collabId: (isCollaboratorsAvailable?.id as string)
        }

      })

      const findCollaborator = hasApprovedCollaborators.filter((collabData: ICollaborators, index: number) => (collabData?.collaboratorEmail == collabUsersEmail))

      if ((hasApprovedCollaborators.length < MAX_COLLABORATORS)) {
        if (findCollaborator.length > 0) {
          res.json({
            collaboratingDocs: isCollaboratorsAvailable,
            collaborator: findCollaborator, message: "user is already a collaborator"
          })
          return;
        }

        const joinCollaborators = await prisma?.collaborator?.create({
          data: {
            collaboratorEmail: String(collabUsersEmail),
            isSigned: false as boolean,
            collabId: isCollaboratorsAvailable?.id as string,
          },
        });

        const subject = "Test Email";
        const htmlContent = "<h1>This is a test email for Collaborators</h1>";

        const result = await sendMailWithNodeMailer(collabUsersEmail, subject, htmlContent);

        res.json({
          collaboratingDocs: isCollaboratorsAvailable,
          collaborator: joinCollaborators,
          previousCollaborators: hasApprovedCollaborators,
          status: true,
          message: "User is added to Doc Collaboration and an email has been send to them",
        });
      } else {
        res.json({
          collaboratingDocs: isCollaboratorsAvailable,
          previousCollaborators: hasApprovedCollaborators,
          status: true,
          message: `Collaboration for this document ${isCollaboratorsAvailable.id} has reached maximum`,
        });

      }

    } else {
      res.json({
        message: "No such Document to collaborate.",
      });
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

    const collabDocs = await prisma.collaborateDocs.findFirst({
      where: {
        roomId: roomId,
      },
    });
    if (collabDocs?.id != undefined) {
      const documentCollaborators = await prisma.collaborator.findMany({
        where: {
          collabId: (collabDocs.id as string)
        }
      })

      res.json({
        collaboratingDocuments: collabDocs,
        collaborators: documentCollaborators,
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

export const getNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {



  try {
    const { receiverUserId } = req.body;
    const receiverData = await prisma.notification.findMany({
      where: { user: receiverUserId },
    });



    if (receiverData.length != 0) {
      res.json({
        response: receiverData,
        message: "users notification",
        status: true
      });
    } else {
      res.json({
        response: [],
        message: "No Notification for User",
        status: false
      });
    }
  } catch (err) {
    console.log(err);
    res.json({ response: "server issue occured", status: false });
  }
};

export const getChatNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { receiverUserId } = req.body;

  try {



    const receiverData = await prisma.chat.findMany({
      where: { receiverUserId: receiverUserId },
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

export const updateUserNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { notification_id, user } = req.body;
  console.log('hh');

  try {
    const receiverData = await prisma.notification.update({
      where: {
        id: notification_id,
        user: user
      },
      data: {
        isRead: true,
      },
    });

    if (receiverData?.id != null) {
      res.json({
        response: receiverData,
        message: `Successfully updated user notification to read.`,
      });
    } else {
      res.json({
        response: false,
        message: `Failed to update user notification as read`,
      });
    }
  } catch {
    res.json({ response: "server issue occured", status: false });
  }
};


export const getUserdetails = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.body;
  const userDetails = await prisma.user?.findFirst({
    where: { id: user },
  });
  if (userDetails) {
    res.json({
      message: "user details",
      respone: userDetails,
      status: true,
    });
  } else {
    res.json({
      message: "user not found",
      status: false,
      user: userDetails,
    });
  }

}


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
    // const password = "mz2@P3+D*%?{9CPY!ibyk?wrtmopK}";
    const { password } = req.body;

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
        .then(async (files) => {
          /* Do stuff */
          if (files == undefined) return;
          fs.writeFile(outputPath, files[0]);

          const encryptionData = await prisma.docsEncryption.create({
            data: {
              decryptionLink: fileLink,
              encryptionLink: outputPath,
              encryptionPassword: password,
            },
            select: {
              decryptionLink: true,
              encryptionPassword: true
            }
          })


          res.json({
            response: encryptionData,
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
    const { decryptFileName, password } = req.body;

    const fileLink = getAbsolutePath(
      "../..",
      "src",
      "encrypt/encryptOutput",
      decryptFileName
    );

    const decryptionData = await prisma.docsEncryption.findFirst({
      where: {
        encryptionLink: fileLink
      },
      select: {
        decryptionLink: true,
        encryptionPassword: true,
      }
    })

    if (decryptionData?.encryptionPassword != password) {
      res.json({ message: "password is not correct ", status: false })
    }


    if ((decryptionData?.encryptionPassword == password) && (decryptionData?.decryptionLink != undefined)) {
      res.json({ response: decryptionData, message: "decryption successfull", status: true });
    }
    if (decryptionData?.decryptionLink == undefined) {
      res.json({ message: "encryption Link not available ", status: false });
    }

  } catch (err) {
    res.json({ message: "server error occured", status: false, error: err });
  }
};

export const generatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let length = req.params.length;
    const passwordGenerate = generateUsersPassword(Number(length))
    const hasGenerated = await prisma.generatePassword.findMany({
      where: {
        password: passwordGenerate
      }
    })
    if (hasGenerated.length > 0) {
      const passwordNewPassword = generateUsersPassword(Number(length))
      prisma.generatePassword.create(
        {
          data: {
            password: passwordNewPassword
          }
        })

      res.json({ response: passwordNewPassword, message: "password already exist but new user password is generated" })
    } else {

      prisma.generatePassword.create(
        {
          data: {
            password: passwordGenerate
          }
        })

      res.json({ response: passwordGenerate, message: "password generated" })
    }
  } catch (err) {
    res.json({ message: "server error occured", status: false, error: err });
  }


}
