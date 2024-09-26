"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDocument = exports.signDocument = exports.getContractTemplates = exports.getNotifications = exports.generateDocumentLink = exports.removeCollaborator = exports.toggleCollaboration = exports.requestSignature = exports.addCollaborator = exports.createDocument = exports.searchUsersByEmail = exports.userRecoverPassword = exports.userLogin = exports.updatePassword = exports.googleOnboarding = exports.userOnboarding = exports.homePage = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const useHook_1 = require("../utilities/useHook");
const client_1 = __importDefault(require("../model/prismaClient/client"));
const convertapi_1 = __importDefault(require("convertapi"));
const convertapi = new convertapi_1.default("r0ps82oFwtrDLyGO", {
    conversionTimeout: 60,
});
const homePage = (req, res) => {
    res.json({ message: "running successfully" });
};
exports.homePage = homePage;
const MAX_COLLABORATORS = 5;
const userOnboarding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { email, firstname, lastname, password, company } = (req.body);
        const salt = yield (0, useHook_1.generateSalt)();
        const hashpassword = yield (0, useHook_1.hashPass)(password, salt);
        const isUserExist = yield ((_a = client_1.default.user) === null || _a === void 0 ? void 0 : _a.findFirst({
            where: { email: email },
        }));
        if (isUserExist) {
            res.json({ message: "user already exist", status: false });
        }
        const userReponse = yield ((_b = client_1.default.user) === null || _b === void 0 ? void 0 : _b.create({
            data: {
                email: email,
                firstname: firstname,
                lastname: lastname,
                password: password,
                company: company,
                salt: salt,
                hashpassword: hashpassword,
            },
        }));
        if (userReponse.id != undefined) {
            res.json({
                message: "registration was successful",
                status: true,
                response: userReponse,
            });
        }
    }
    catch (_c) {
        res.json({ message: "error occured" });
    }
});
exports.userOnboarding = userOnboarding;
const googleOnboarding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    try {
        const { email, firstname, lastname, password, company } = (req.body);
        const salt = yield (0, useHook_1.generateSalt)();
        const hashpassword = yield (0, useHook_1.hashPass)(password, salt);
        const isUserExist = yield ((_d = client_1.default.user) === null || _d === void 0 ? void 0 : _d.findFirst({
            where: { email: email },
        }));
        if (isUserExist) {
            res.json({ message: "user already exist", status: false });
        }
        const userReponse = yield ((_e = client_1.default.user) === null || _e === void 0 ? void 0 : _e.create({
            data: {
                email: email,
                firstname: firstname,
                lastname: lastname,
                password: password,
                company: company,
                salt: salt,
                hashpassword: hashpassword,
            },
        }));
        if (userReponse.id != undefined) {
            res.json({
                message: "registration was successful",
                status: true,
                response: userReponse,
            });
        }
    }
    catch (_f) {
        res.json({ message: "error occured" });
    }
});
exports.googleOnboarding = googleOnboarding;
const updatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //USE FOR VALIDATION
    var _g;
    // const result = passwordSchema.safeParse(password);
    // if (!result.success) {
    //   res.json({message:"Password validation failed:",error:result.error.issues});
    // } else {
    // }
    try {
        const { password } = req.body;
        const salt = yield (0, useHook_1.generateSalt)();
        const hashpassword = yield (0, useHook_1.hashPass)(password, salt);
        const isPasswordExist = yield ((_g = client_1.default.user) === null || _g === void 0 ? void 0 : _g.findFirst({
            where: { password: password },
        }));
        if (!isPasswordExist) {
            res.json({ message: "User's password not found.", status: false });
        }
        else {
            const updatedUser = yield client_1.default.user.update({
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
    }
    catch (error) {
        res.json({
            message: "Error occured while updating passowrd",
            status: false,
        });
    }
});
exports.updatePassword = updatePassword;
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const auth = req.get("Authorization");
    try {
        const { email, password } = req.body;
        const usersLoginResponse = yield client_1.default.user.findFirst({
            where: {
                email: email,
                password: password,
            },
        });
        if (usersLoginResponse) {
            const tokenAuth = yield (0, useHook_1.usersAuth)(usersLoginResponse);
            if (tokenAuth) {
                res.json({
                    authToken: tokenAuth,
                    status: true,
                    response: usersLoginResponse,
                });
            }
        }
        else {
            res.json({ response: "user not found ", status: false });
        }
    }
    catch (_h) {
        res.json({ response: "error occured", status: false });
    }
});
exports.userLogin = userLogin;
const userRecoverPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    try {
        const { email } = req.body;
        const usersRecoveryData = yield ((_j = client_1.default.user) === null || _j === void 0 ? void 0 : _j.findFirst({
            where: { email: email },
        }));
        if (usersRecoveryData) {
            res.json({
                message: "user is avaliable",
                recoveryData: usersRecoveryData,
                status: true,
            });
        }
        else {
            res.json({
                message: "user not found",
                status: false,
                user: usersRecoveryData,
            });
        }
    }
    catch (_k) {
        res.json({ response: "error occured", status: false });
    }
});
exports.userRecoverPassword = userRecoverPassword;
const searchUsersByEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    try {
        const { email } = req.body;
        const searchUsersData = yield ((_l = client_1.default.user) === null || _l === void 0 ? void 0 : _l.findFirst({
            where: { email: email },
        }));
        if (searchUsersData) {
            res.json({
                message: "user is avaliable",
                recoveryData: searchUsersData,
                status: true,
            });
        }
        else {
            res.json({
                message: "user not found",
                status: false,
                user: searchUsersData,
            });
        }
    }
    catch (_m) {
        res.json({ response: "error occured", status: false });
    }
});
exports.searchUsersByEmail = searchUsersByEmail;
const createDocument = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, contentType, contentPath, ownerId, contractTemplateId } = req.body;
        const document = yield client_1.default.document.create({
            data: {
                title,
                contentType,
                contentPath,
                ownerId,
                contractTemplateId, // Optional: if the document uses a contract template
            },
        });
        res.json({ message: "document created successfully", document, statusCode: 201 });
    }
    catch (err) {
        res.json({ message: " Create Document failed", err, statusCode: 500 });
    }
});
exports.createDocument = createDocument;
const addCollaborator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { documentId, collaboratorId } = req.body;
    try {
        const document = yield client_1.default.document.findUnique({
            where: { id: documentId },
            include: { collaborators: true },
        });
        if (document && document.collaborators.length < 5) {
            const collaboration = yield client_1.default.collaboration.create({
                data: {
                    documentId,
                    userId: collaboratorId,
                    role: 'COLLABORATOR', // Could be 'SIGNER' or 'COLLABORATOR'
                },
            });
            res.json({ message: "Collaborator added successfully", collaboration, statusCode: 201 });
        }
        else {
            res.json({ message: "Add Collaborator failed" });
        }
    }
    catch (err) {
        res.json({ message: " Add Collaborator failed", err, statusCode: 500 });
    }
});
exports.addCollaborator = addCollaborator;
const requestSignature = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { documentId, signerId } = req.body;
    try {
        const notification = yield client_1.default.notification.create({
            data: {
                userId: signerId,
                documentId,
                type: 'SIGNATURE_REQUEST',
            },
        });
        res.json({ message: "signature requested successfully", notification, statusCode: 201 });
    }
    catch (err) {
        res.json({ message: " signature requested failed", err, statusCode: 500 });
    }
});
exports.requestSignature = requestSignature;
const toggleCollaboration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { documentId, isCollaborationOn } = req.body;
    try {
        const updatedDocument = yield client_1.default.document.update({
            where: { id: documentId },
            data: {
                isCollaborationOn,
            },
        });
        res.json({ message: "Collaboration mode updated successfull", updatedDocument, statusCode: 201 });
    }
    catch (err) {
        res.json({ message: " Collaboration mode updated failed", err, statusCode: 500 });
    }
});
exports.toggleCollaboration = toggleCollaboration;
const removeCollaborator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { documentId, collaboratorId, originatorId } = req.body;
    try {
        const document = yield client_1.default.document.findUnique({
            where: { id: documentId },
        });
        if (document && document.ownerId === originatorId) {
            const removedCollaboration = yield client_1.default.collaboration.deleteMany({
                where: {
                    documentId,
                    userId: collaboratorId,
                },
            });
            res.json({ message: "Collaborator removed successfull", removedCollaboration, statusCode: 201 });
        }
        else {
            res.json({ message: "Unauthorized: Only the originator can remove collaborators" });
        }
    }
    catch (err) {
        res.json({ message: "Remove Collaborator failed", err, statusCode: 500 });
    }
});
exports.removeCollaborator = removeCollaborator;
const generateDocumentLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { documentId, originatorId } = req.body;
    try {
        const document = yield client_1.default.document.findUnique({
            where: { id: documentId },
        });
        if (document && document.ownerId === originatorId) {
            const link = `bluedill://bluedill-contract-document/${documentId}/invite`;
            res.json({ message: "Generated document-specific link successfull", link, statusCode: 201 });
        }
        else {
            res.json({ message: "Unauthorized: Only the originator can generate a link" });
        }
    }
    catch (err) {
        res.json({ message: "Generated document-specific link failed", err, statusCode: 500 });
    }
});
exports.generateDocumentLink = generateDocumentLink;
//   Viewing Notifications
const getNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query; // Extract userId from query params
    if (!userId) {
        return res.status(400).json({ message: "User ID is required", statusCode: 400 });
    }
    try {
        const notifications = yield client_1.default.notification.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json({
            message: "Notifications for user successful",
            notifications,
            statusCode: 200
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Notifications for user failed",
            error: err,
            statusCode: 500
        });
    }
});
exports.getNotifications = getNotifications;
const getContractTemplates = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const templates = yield client_1.default.contractTemplate.findMany();
        res.json({ message: "Available contract templates successfull", templates, statusCode: 201 });
    }
    catch (err) {
        res.json({ message: "Available contract templates failed", err, statusCode: 500 });
    }
});
exports.getContractTemplates = getContractTemplates;
const signDocument = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { documentId, userId } = req.body;
    try {
        const updatedCollaboration = yield client_1.default.collaboration.updateMany({
            where: {
                documentId,
                userId,
                role: 'SIGNER',
            },
            data: {
                signed: true,
            },
        });
        res.json({ message: "Document signed successfull", updatedCollaboration, statusCode: 201 });
    }
    catch (err) {
        res.json({ message: "Document signing failed", statusCode: 500 });
    }
});
exports.signDocument = signDocument;
const updateDocument = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { documentId, contentPath } = req.body;
    try {
        const updatedDocumentdata = yield client_1.default.document.updateMany({
            where: {
                id: documentId,
            },
            data: {
                contentPath: contentPath,
            },
        });
        res.json({ message: "Document updated successfull", updatedDocumentdata, statusCode: 201 });
    }
    catch (err) {
        res.json({ message: "Document updated failed", statusCode: 500 });
    }
});
exports.updateDocument = updateDocument;
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
// export const userLoginByEmail = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { email } = req.body;
//     const usersLoginResponseByEmail = await prisma.user.findFirst({
//       where: {
//         email: email,
//       },
//     });
//     if (usersLoginResponseByEmail) {
//       const tokenAuth = await usersAuth(
//         usersLoginResponseByEmail as IRegistration
//       );
//       if (tokenAuth) {
//         res.json({
//           authToken: tokenAuth,
//           status: true,
//           response: usersLoginResponseByEmail,
//         });
//       }
//     } else {
//       res.json({ response: "user not found ", status: false });
//     }
//   } catch {
//     res.json({ response: "error occured", status: false });
//   }
// };
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
