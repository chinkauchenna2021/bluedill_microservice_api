import { Request, Response, NextFunction, response } from "express";
import {
  IRegistration,
  ILogin,
  IDocument,
  IUsersChat,
  ICollaboration,
  IDocUpdate,
  IPassword,
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

const convertapi = new ConvertAPI("r0ps82oFwtrDLyGO", {
  conversionTimeout: 60,
});

import Cryptify from "cryptify";
import { passwordSchema } from "../dto/typeSafeWithZod";

export const homePage = (req: Request, res: Response) => {
  res.json({ message: "running successfully" });
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

export const googleOnboarding = async (req: Request, res: Response) => {
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

export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //USE FOR VALIDATION

  // const result = passwordSchema.safeParse(password);

  // if (!result.success) {
  //   res.json({message:"Password validation failed:",error:result.error.issues});
  // } else {

  // }

  try {
    const { password } = <IPassword>req.body;

    const salt = await generateSalt();
    const hashpassword = await hashPass(password, salt);

    const isPasswordExist = await prisma.user?.findFirst({
      where: { password: password },
    });

    if (!isPasswordExist) {
      res.json({ message: "User's password not found.", status: false });
    } else {
      const updatedUser = await prisma.user.update({
        where: { id: isPasswordExist.id },
        data: { password: password, hashpassword: hashpassword },
      });

      if (updatedUser) {
        res.json({
          message: "User's password updated successfully ",
          status: true,
        });
      }
    }
  } catch (error) {
    res.json({
      message: "Error occured while updating passowrd",
      status: false,
    });
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




export const createDocument = async( req:Request, res:Response , next:NextFunction)=>{
   try{
   const { title , contentType , contentPath , ownerId, contractTemplateId}  = <{ title: string,contentType: 'LEXICAL' | 'DOCX',ownerId:string, contentPath: string,contractTemplateId?: string}>req.body

  const document = await prisma.document.create({
    data: {
      title,
      contentType,
      contentPath,
      ownerId,
      contractTemplateId,  // Optional: if the document uses a contract template
    },
  });

    res.json({message:"document created successfully", document , statusCode:201})

   }catch(err){
       res.json({message : " Create Document failed" ,err ,  statusCode:500 })
   }

}




export const  addCollaborator = async(req:Request, res:Response , next:NextFunction)=>{
const {documentId ,collaboratorId} = <{documentId: string, collaboratorId: string}>req.body

   try{
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { collaborators: true },
    });
  
    if (document && document.collaborators.length < 5) {
      const collaboration = await prisma.collaboration.create({
        data: {
          documentId,
          userId: collaboratorId,
          role: 'COLLABORATOR',  // Could be 'SIGNER' or 'COLLABORATOR'
        },
      });
  

     res.json({message:"Collaborator added successfully", collaboration , statusCode:201})
    } else {
      res.json({message : "Add Collaborator failed" })
    }
  
  }catch(err){
    res.json({message : " Add Collaborator failed" ,err ,  statusCode:500 })
  }
}

export const  requestSignature = async(req:Request, res:Response , next:NextFunction)=>{

  const {documentId ,signerId} = <{documentId: string, signerId: string}>req.body
        try{
        const notification = await prisma.notification.create({
        data: {
          userId: signerId,
          documentId,
          type: 'SIGNATURE_REQUEST',
        },
      });

    const updatedCollaboration = await prisma.collaboration.updateMany({
      where: {
        documentId,
        userId: signerId,
      },
      data: {
        role: 'SIGNER',  // Update the role to SIGNER
      },
    });
    
       res.json({message:"signature requested successfully", notification,  updatedCollaboration ,  statusCode:201}) 
    }catch(err){
      res.json({message : " signature requested failed" ,err ,  statusCode:500 })
    }
  }


export const toggleCollaboration = async(req:Request , res:Response , next:NextFunction)=>{
  const {documentId ,isCollaborationOn} = <{documentId: string, isCollaborationOn: boolean}>req.body
  console.log(documentId , isCollaborationOn , " toggled")
try{

    const updatedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        isCollaborationOn,
      },
    });

    res.json({message:"Collaboration mode updated successfull", updatedDocument , statusCode:201}) 

}catch(err){
  res.json({message : " Collaboration mode updated failed" ,err ,  statusCode:500 })
}

}




export const removeCollaborator = async (req:Request , res:Response , next:NextFunction)=>{
  const {documentId ,collaboratorId,originatorId} = <{documentId: string, collaboratorId: string, originatorId: string}>req.body
  try{
      const document = await prisma.document.findUnique({
        where: { id: documentId },
      });
    
      if (document && document.ownerId === originatorId) {
        const removedCollaboration = await prisma.collaboration.deleteMany({
          where: {
            documentId,
            userId: collaboratorId,
          },
        });
    
        res.json({message:"Collaborator removed successfull", removedCollaboration , statusCode:201}) 
      } else {
        res.json({message : "Unauthorized: Only the originator can remove collaborators" })
      }
  }catch(err){
    res.json({message : "Remove Collaborator failed" ,err ,  statusCode:500 })
  }
}



export const generateDocumentLink = async (req:Request , res:Response , next:NextFunction)=>{
  const {documentId ,originatorId} = <{documentId: string, originatorId: string}>req.body
  try{
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });

    if (document && document.ownerId === originatorId) {
    const link = `bluedill://bluedill-contract-document/${documentId}/invite`;
    res.json({message:"Generated document-specific link successfull", link , statusCode:201}) 
  } else {
    res.json({message:"Unauthorized: Only the originator can generate a link"}) 
  }

  }catch(err){
    res.json({message : "Generated document-specific link failed" ,err ,  statusCode:500 })
  }
}


//   Viewing Notifications

export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
    console.log(userId, "id sent")
  if (!userId) {
    return res.status(400).json({ message: "User ID is required", statusCode: 400 });
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        document: {
          select: {
            id: true,
            title: true,
            contentType: true,
            owner: {
              select: {
                firstname: true,
                lastname: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });
    
    res.status(200).json({
      message: "Notifications for user successful",
      notifications,
      statusCode: 200
    });
  } catch (err) {
    res.status(500).json({
      message: "Notifications for user failed",
      error: err,
      statusCode: 500
    });
  }
};



export const getContractTemplates = async(req:Request,res:Response, next:NextFunction) =>{
  try{
      const templates = await prisma.contractTemplate.findMany();
      res.json({message:"Available contract templates successfull", templates , statusCode:201})   

  }catch(err){
    res.json({message : "Available contract templates failed" ,err ,  statusCode:500 })
  }
}




export const signDocument = async (req:Request , res:Response,next:NextFunction) =>{
  const {documentId, userId} = <{documentId: string, userId: string}>req.body
  console.log(documentId , userId , " data received ")
  try{
      const updatedCollaboration = await prisma.collaboration.updateMany({
        where: {
          documentId,
          userId,
          role: 'SIGNER',
        },
        data: {
          signed: true,
        },
      });
    
      res.json({message:"Document signed successfull", updatedCollaboration , statusCode:201})   

  }catch(err){
    res.json({message : "Document signing failed" ,statusCode:500 })
  }
}


export const updateDocument = async (req:Request , res:Response,next:NextFunction) =>{
  const {documentId, contentPath} = <{documentId: string, contentPath: string}>req.body
  try{

      const updatedDocumentdata = await prisma.document.updateMany({
        where: {
          id:documentId,
        },
        data: {
          contentPath: contentPath,
        },
      });
    
      res.json({message:"Document updated successfull", updatedDocumentdata , statusCode:201})   

  }catch(err){
    res.json({message : "Document updated failed" ,statusCode:500 })
  }
}


export const createContractTemplates = async(req:Request,res:Response, next:NextFunction) =>{
  const {name, description , filePath} = <{name: string, description: string, filePath:string }>req.body
    try {
      const newTemplate = await prisma.contractTemplate.create({
        data: {
          name:name,
         description:description,
         filePath:filePath, // Path to the template file
        },
      });

      res.json({message:"New ContractTemplate Created:", newTemplate , statusCode:201})   
    } catch (error) {
      res.json({message : "Error creating ContractTemplate:" ,error ,  statusCode:500 })
    }
}




export const getDocumentsByOwner = async (req: Request, res: Response) => {
  const { ownerId } = <{ownerId:string}>req.params;
  try {
    const documents = await prisma.document.findMany({
      where: {
        ownerId,
      },
      select: {
        id: true,                   // Include document ID
        title: true,
        contentType: true,
        contentPath: true,      // Path to .lexical or .docx files
        ownerId: true,
        owner: true , 
        createdAt:true,                // Include document title
        collaborators: {
          select: {
            userId: true,           // Include collaborator user ID
            role: true,             // Include collaborator role (e.g., SIGNER, COLLABORATOR)
            user: {                 // If you want to include user details (e.g., name, email)
              select: {
                firstname: true,
                lastname: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res.json({ message: "Documents retrieved successfully", documents, statusCode: 200 });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve documents", error: err });
  }
};





export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const { ownerId } = req.body; // Assuming the request contains the ownerId

    // Fetch the document to verify ownership
    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
      },
    });

    // Check if the document exists
    if (!document) {
      return res.status(404).json({ message: "Document not found", statusCode: 404 });
    }

    // Verify that the user requesting the deletion is the owner
    if (document.ownerId !== ownerId) {
      return res.status(403).json({ message: "You are not authorized to delete this document", statusCode: 403 });
    }

    // Delete the document since the owner is verified
    await prisma.document.delete({
      where: {
        id: documentId,
      },
    });

    res.json({ message: "Document deleted successfully", statusCode: 200 });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete document", error: err });
  }
};




export const searchUserByEmail = async (req: Request, res: Response) => {
      const { email } = <{email:string}>req.body;
      console.log(email , "this is the users email")
  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required', status: false });
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email) }, 
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        company: true,
      }, 
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found', status: false });
    }
    return res.status(200).json({ message: 'User found', status: true, user });
    
  } catch (error: any) {
    // console.error('Error searching user by email:', error);
    return res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};



export const getDocumentCollaborators = async (req: Request, res: Response, next: NextFunction) => {
  const { documentId } = req.params;

  try {
    // Find the document and its collaborators
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        collaborators: {
          include: {
            user: true, // Include user information of each collaborator
          },
        },
      },
    });

    if (!document) {
      return res.status(404).json({ message: 'Document not found', statusCode: 404 });
    }

    // Extract collaborator details
    const collaborators = document.collaborators.map((collaboration) => collaboration.user);

    res.status(200).json({
      message: 'Collaborators retrieved successfully',
      collaborators,
      statusCode: 200,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve collaborators', error });
  }
};




export const getCollaboratedDocuments = async (req: Request, res: Response) => {
  const { userId } = req.params; // Assuming you're passing userId as a route parameter
    console.log(userId , " user id generated");
  try {
    const documents = await prisma.document.findMany({
      where: {
        collaborators: {
          some: {
            userId, 
          },
        },
      },
      select: {
        id: true,               
        title: true,            
        contentType: true,       
        contentPath: true,       
        ownerId: true,           
        createdAt: true,       
        updatedAt: true,        
        collaborators: {         
          include: {
            user: {             
              select: {
                id: true,       
                firstname: true,  
                lastname: true,
                email: true,     
              },
            },
          },
        },
      },
    });

    res.status(200).json({ message: "Collaborated documents retrieved successfully", documents });
  } catch (error) {
    console.error(error); // Logging the error for debugging
    res.status(500).json({ message: "Failed to retrieve collaborated documents", error: error });
  }
};




export const getDocumentById = async (req: Request, res: Response) => {
  const { documentId } = req.params; // Get the document ID from the request parameters
  try {
    // Fetch the document by ID
    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
      },
      include: {
        collaborators: {
          include: {
            user: true,  // Include the user details for each collaborator
          },
        }, // Optional: Include collaborators if needed
        owner: true,         // Optional: Include owner details if needed
      },
    });

    // Check if the document exists
    if (!document) {
      return res.status(404).json({ message: "Document not found", statusCode: 404 });
    }

    // Respond with the retrieved document
    res.status(200).json({ message: "Document retrieved successfully", document, statusCode: 200 });
  } catch (error) {
    console.error('Error retrieving document:', error);
    res.status(500).json({ message: "Failed to retrieve document", error: error });
  }
};





export async function deleteNotification(req: Request, res: Response, next: NextFunction){
  const { notificationId } = <{ notificationId: string }>req.body;

  console.log(notificationId, "Notification ID received");

  try {
    // Delete the notification with the provided ID
    const deletedNotification = await prisma.notification.delete({
      where: {
        id: notificationId,
      },
    });

    res.json({
      message: "Notification deleted successfully",
      deletedNotification,
      statusCode: 200,
    });
  } catch (err) {
    console.error("Error deleting notification:", err);

    res.status(500).json({
      message: "Failed to delete notification",
      statusCode: 500,
      error: err,
    });
  }
};




























































// export const adminUploadTemplates = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { docid, docname, templateType } = <IDocument>req.body;
//     const { id } = <IRegistration>req.user;
//     const fileupload = req.file as unknown as Express.Multer.File;
//     const filename = fileupload.filename as string;
//     let updateTemplate = await prisma.document?.create({
//       data: {
//         docid: docid,
//         docname: docname,
//         doclink: filename,
//         userUpdateDoc: id as string,
//         templateType: templateType,
//       },
//     });

//     if (updateTemplate) {
//       res.json({ response: "template added successfully", status: true });
//     } else {
//       res.json({ response: "something went wrong", status: false });
//     }
//   } catch (err) {
//     res.json({ response: "server error", status: false });
//   }
// };

// export const getAllTemplates = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const allDocuments = await prisma.document?.findMany();
//     res.json({ response: allDocuments, status: true });
//   } catch (err) {
//     res.json({ response: "server issue occured", status: false });
//   }
// };

// export const usersChat = async (
//   req: Request,
//   res: Response,
//   nexr: NextFunction
// ) => {
//   try {
//     // const { id, email } = <IRegistration>req.user;

//     const { sendersEmail, receiversemail, message } = <IUsersChat>req.body;
//     const recieversData = await prisma.user.findFirst({
//       where: { email: receiversemail },
//     });

//     const senderData = await prisma.user.findFirst({
//       where: { email: sendersEmail },
//     });

//     if (recieversData?.id != null) {
//       const chatusers = await prisma.chat.create({
//         data: {
//           userEmail: sendersEmail,
//           userMessage: message,
//           senderUserId: senderData?.id as string,
//           receiverUserId: recieversData?.id as string,
//           isReceivedStatus: true,
//           user: {
//             connect: {
//               id: recieversData?.id as string,
//             },
//           },
//         },
//       });

//       if (chatusers.id != null) {
//         res.json({
//           response: `message sent to user with the id ${recieversData.id}`,
//           status: true,
//           message: message,
//         });
//       }
//     } else {
//       res.json({ response: "reciever does not exist ", status: false });
//     }
//   } catch {
//     res.json({ response: "server issue occured", status: false });
//   }
// };

// export const createCollaboration = async (req: Request, res: Response) => {
//   const { docId, docName, roomId } = req.body;

//   try {
//     const collab = await prisma.collaborateDocs.findFirst({
//       where: {
//         roomId: roomId,
//         docid: docId,
//       },
//     });

//     if (collab == null) {
//       const collabCreated = await prisma.collaborateDocs.create({
//         data: {
//           docid: docId,
//           docname: docName,
//           roomId: roomId,
//           requestingSignature: false,
//         },
//       });
//       res.json({
//         response: "Document Collaboration created",
//         status: true,
//         message: collabCreated,
//       });
//     } else {
//       res.json({
//         response:
//           "Document Collaboration creation failed. Collaboration already exist",
//         status: false,
//       });
//     }
//   } catch (err) {
//     res.json({ response: "server Error occured", status: false, error: err });
//   }
// };

// export const addCollaborators = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // add collaborators

//     const { roomId, collabUsersEmail } = req.body;

//     const isCollaboratorsAvailable = await prisma.collaborateDocs.findFirst({
//       where: { roomId: roomId },
//     });

//     if (isCollaboratorsAvailable?.id != undefined) {
//       const hasApprovedCollaborators = await prisma.collaborator.findMany({
//         where: {
//           collabId: isCollaboratorsAvailable?.id as string,
//         },
//       });

//       const findCollaborator = hasApprovedCollaborators.filter(
//         (collabData: ICollaborators, index: number) =>
//           collabData?.collaboratorEmail == collabUsersEmail
//       );

//       if (hasApprovedCollaborators.length < MAX_COLLABORATORS) {
//         if (findCollaborator.length > 0) {
//           res.json({
//             collaboratingDocs: isCollaboratorsAvailable,
//             collaborator: findCollaborator,
//             message: "user is already a collaborator",
//           });
//           return;
//         }

//         const joinCollaborators = await prisma?.collaborator?.create({
//           data: {
//             collaboratorEmail: String(collabUsersEmail),
//             isSigned: false as boolean,
//             collabId: isCollaboratorsAvailable?.id as string,
//           },
//         });
//         res.json({
//           collaboratingDocs: isCollaboratorsAvailable,
//           collaborator: joinCollaborators,
//           previousCollaborators: hasApprovedCollaborators,
//           status: true,
//           message: "User is added to Doc Collaboration",
//         });
//       } else {
//         res.json({
//           collaboratingDocs: isCollaboratorsAvailable,
//           previousCollaborators: hasApprovedCollaborators,
//           status: true,
//           message: `Collaboration for this document ${isCollaboratorsAvailable.id} has reached maximum`,
//         });
//       }
//     } else {
//       res.json({
//         message: "No such Document to collaborate.",
//       });
//     }
//   } catch (err) {
//     res.json({ response: "server Error occured", status: false, error: err });
//   }
// };

// export const getCollaboratorDocs = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { roomId } = req.body;

//     const collabDocs = await prisma.collaborateDocs.findFirst({
//       where: {
//         roomId: roomId,
//       },
//     });
//     if (collabDocs?.id != undefined) {
//       const documentCollaborators = await prisma.collaborator.findMany({
//         where: {
//           collabId: collabDocs.id as string,
//         },
//       });

//       res.json({
//         collaboratingDocuments: collabDocs,
//         collaborators: documentCollaborators,
//         status: true,
//         message: "Collaboration Document found",
//       });
//     } else {
//       res.json({ message: "Collaboration Document Not found", status: false });
//     }
//   } catch (err) {
//     res.json({ response: "server Error occured", status: false, error: err });
//   }
// };

// export const getChatMessage = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { sendersEmail, recieversEmail } = req.body;
//   // const { id } = req.user;
//   try {
//     const receiverData = await prisma.user.findFirst({
//       where: { email: recieversEmail },
//     });

//     const senderData = await prisma.user.findFirst({
//       where: { email: sendersEmail },
//     });

//     if (receiverData?.id != null && senderData?.id != null) {
//       const sentMessages = await prisma.chat.findMany({
//         where: {
//           userEmail: sendersEmail,
//           receiverUserId: receiverData?.id,
//         },
//       });

//       const receiversMessages = await prisma.chat.findMany({
//         where: {
//           userEmail: recieversEmail,
//           receiverUserId: senderData?.id,
//         },
//       });

//       res.json({
//         sentMessages: sentMessages,
//         recieveMessages: receiversMessages,
//         status: true,
//       });
//     } else {
//       res.json({
//         response: `no such user with email ${recieversEmail} exist `,
//         status: false,
//       });
//     }
//   } catch {
//     res.json({ response: "server issue occured", status: false });
//   }
// };

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

// export const getChatNotification = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { receiverUserId } = req.body;
//   // const { id } = req.user;
//   try {
//     const receiverData = await prisma.chat.findMany({
//       where: { receiverUserId: receiverUserId, isReceivedStatus: false },
//     });

//     if (receiverData.length != 0) {
//       let userNotify = await getChatNotifier(receiverData);
//       res.json({
//         response: userNotify,
//         message: "users notification",
//       });
//     } else {
//       res.json({
//         response: [],
//         message: "No Notification for User",
//       });
//     }
//   } catch {
//     res.json({ response: "server issue occured", status: false });
//   }
// };

// export const updateChatNotification = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { chatId } = req.body;
//   // const { id } = req.user;
//   try {
//     const receiverData = await prisma.chat.update({
//       where: {
//         id: chatId,
//       },
//       data: {
//         isReceivedStatus: true,
//       },
//     });

//     if (receiverData?.id != null) {
//       res.json({
//         response: receiverData,
//         message: `users notification with id ${receiverData.id} was updated successfully `,
//       });
//     } else {
//       res.json({
//         response: false,
//         message: `users notification with id ${chatId} failed`,
//       });
//     }
//   } catch {
//     res.json({ response: "server issue occured", status: false });
//   }
// };

// export const updateDocument = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const {
//       docid,
//       docname,
//       doclink,
//       userUpdateDoc,
//       templateType,
//       isEncrypted,
//       securityCode,
//       docformat,
//     } = req.body;

//     const docData = await prisma.document.update({
//       where: {
//         docid: docid,
//       },
//       data: {
//         docname: docname,
//         doclink: doclink,
//         userUpdateDoc: userUpdateDoc,
//         templateType: templateType,
//         isEncrypted: isEncrypted,
//         securityCode: securityCode,
//         docformat: docformat,
//       },
//     });

//     if (docData.docid != null) {
//       res.json({
//         response: docData,
//         message: `Document with id ${docData.id} was updated successfully `,
//       });
//     } else {
//       res.json({
//         response: docData,
//         message: `Document update failed `,
//       });
//     }
//   } catch (err) {
//     res.json({ response: "server issue occured", status: false });
//   }
// };

// export const getAllDocument = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const allDocs = await prisma.document.findMany();
//     if (allDocs.length != 0) {
//       res.json({
//         response: allDocs,
//         message: `All templates collected successfully `,
//       });
//     } else {
//       res.json({
//         response: allDocs,
//         message: `Template Collection failed `,
//       });
//     }
//   } catch (err) {
//     res.json({ response: "server issue occured", status: false });
//   }
// };

// export const fileConverter = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { convertFormat } = req.body;
//     const fileupload = req.file as unknown as Express.Multer.File;
//     const filename = fileupload.filename as string;
//     const filenameWithoutExt = getFileName(filename);
//     const fileLink = getAbsolutePath(
//       "../..",
//       "src",
//       "convertedFiles",
//       filename
//     );
//     const outputPath = getAbsolutePath(
//       "../..",
//       "src",
//       "convertedFiles/fileConversionOutput",
//       filenameWithoutExt + "." + convertFormat
//     );

//     const result = await convertapi
//       .convert(convertFormat, { File: fileLink })
//       .then(function (result) {
//         // get converted file url
//         console.log("Converted file url: " + result.file.url);
//         res.json({
//           response_local_url: fileLink,
//           onlineSavedFile: result.file.url,
//           message: "file converted successfully",
//           status: true,
//         });

//         return result.file.save(outputPath);
//       })
//       .then(function (file) {
//         console.log("File saved: " + file);
//       })
//       .catch(function (e) {
//         res.json({ message: "error occured during file conversion" });
//       });
//   } catch (err) {
//     res.json({ message: "server error occured", status: false, error: err });
//   }
// };

// export const encryptFile = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     // const password = "mz2@P3+D*%?{9CPY!ibyk?wrtmopK}";
//     const { password } = req.body;

//     if (password !== null) {
//       const fileupload = req.file as unknown as Express.Multer.File;
//       const filename = fileupload.filename as string;
//       const fileLink = getAbsolutePath("../..", "src", "encrypt", filename);
//       const outputPath = getAbsolutePath(
//         "../..",
//         "src",
//         "encrypt/encryptOutput",
//         "encoded-" + filename
//       );
//       const cryptifyResponse = new Cryptify(fileLink, password);
//       cryptifyResponse
//         .encrypt()
//         .then(async (files) => {
//           /* Do stuff */
//           if (files == undefined) return;
//           fs.writeFile(outputPath, files[0]);

//           const encryptionData = await prisma.docsEncryption.create({
//             data: {
//               decryptionLink: fileLink,
//               encryptionLink: outputPath,
//               encryptionPassword: password,
//             },
//             select: {
//               decryptionLink: true,
//               encryptionPassword: true,
//             },
//           });

//           res.json({
//             response: encryptionData,
//             status: true,
//             password: password,
//             message: "file successfully encrypted",
//           });
//         })
//         .catch((e) =>
//           res.json({ response: e, status: false, message: "encryption failed" })
//         );
//     } else {
//       res.json({ status: false, message: "Password is missing" });
//     }
//   } catch (err) {
//     res.json({ message: "server error occured", status: false, error: err });
//   }
// };

// export const decryptFile = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { decryptFileName, password } = req.body;

//     const fileLink = getAbsolutePath(
//       "../..",
//       "src",
//       "encrypt/encryptOutput",
//       decryptFileName
//     );

//     const decryptionData = await prisma.docsEncryption.findFirst({
//       where: {
//         encryptionLink: fileLink,
//       },
//       select: {
//         decryptionLink: true,
//         encryptionPassword: true,
//       },
//     });

//     if (decryptionData?.encryptionPassword != password) {
//       res.json({ message: "password is not correct ", status: false });
//     }

//     if (
//       decryptionData?.encryptionPassword == password &&
//       decryptionData?.decryptionLink != undefined
//     ) {
//       res.json({
//         response: decryptionData,
//         message: "decryption successfull",
//         status: true,
//       });
//     }
//     if (decryptionData?.decryptionLink == undefined) {
//       res.json({ message: "encryption Link not available ", status: false });
//     }
//   } catch (err) {
//     res.json({ message: "server error occured", status: false, error: err });
//   }
// };

// export const generatePassword = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     let length = req.params.length;
//     const passwordGenerate = generateUsersPassword(Number(length));
//     const hasGenerated = await prisma.generatePassword.findMany({
//       where: {
//         password: passwordGenerate,
//       },
//     });
//     if (hasGenerated.length > 0) {
//       const passwordNewPassword = generateUsersPassword(Number(length));
//       prisma.generatePassword.create({
//         data: {
//           password: passwordNewPassword,
//         },
//       });

//       res.json({
//         response: passwordNewPassword,
//         message: "password already exist but new user password is generated",
//       });
//     } else {
//       prisma.generatePassword.create({
//         data: {
//           password: passwordGenerate,
//         },
//       });

//       res.json({ response: passwordGenerate, message: "password generated" });
//     }
//   } catch (err) {
//     res.json({ message: "server error occured", status: false, error: err });
//   }
// };
