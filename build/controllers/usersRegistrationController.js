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
exports.getChatMessage = exports.getRoomCollaborators = exports.collaboratingUsers = exports.usersChat = exports.getAllTemplates = exports.adminUploadTemplates = exports.searchUsersByEmail = exports.userRecoverPassword = exports.userLogin = exports.userOnboarding = exports.homePage = void 0;
const useHook_1 = require("../utilities/useHook");
const client_1 = __importDefault(require("../model/prismaClient/client"));
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
    catch (_d) {
        res.json({ response: "error occured", status: false });
    }
});
exports.userLogin = userLogin;
const userRecoverPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const { email } = req.body;
        const usersRecoveryData = yield ((_e = client_1.default.user) === null || _e === void 0 ? void 0 : _e.findFirst({
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
    catch (_f) {
        res.json({ response: "error occured", status: false });
    }
});
exports.userRecoverPassword = userRecoverPassword;
const searchUsersByEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    try {
        const { email } = req.body;
        const searchUsersData = yield ((_g = client_1.default.user) === null || _g === void 0 ? void 0 : _g.findFirst({
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
    catch (_h) {
        res.json({ response: "error occured", status: false });
    }
});
exports.searchUsersByEmail = searchUsersByEmail;
const adminUploadTemplates = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    try {
        const { docid, docname, templateType } = req.body;
        const { id } = req.user;
        const fileupload = req.file;
        const filename = fileupload.filename;
        let updateTemplate = yield ((_j = client_1.default.document) === null || _j === void 0 ? void 0 : _j.create({
            data: {
                docid: docid,
                docname: docname,
                doclink: filename,
                userUpdateDoc: id,
                templateType: templateType,
            },
        }));
        if (updateTemplate) {
            res.json({ response: "template added successfully", status: true });
        }
        else {
            res.json({ response: "something went wrong", status: false });
        }
    }
    catch (err) {
        res.json({ response: "server error", status: false });
    }
});
exports.adminUploadTemplates = adminUploadTemplates;
const getAllTemplates = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    try {
        const allDocuments = yield ((_k = client_1.default.document) === null || _k === void 0 ? void 0 : _k.findMany());
        res.json({ response: allDocuments, status: true });
    }
    catch (err) {
        res.json({ response: "server issue occured", status: false });
    }
});
exports.getAllTemplates = getAllTemplates;
const usersChat = (req, res, nexr) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, email } = req.user;
        const { receiversemail, message } = req.body;
        const recieversData = yield client_1.default.user.findFirst({
            where: { email: receiversemail },
        });
        if ((recieversData === null || recieversData === void 0 ? void 0 : recieversData.id) != null) {
            const chatusers = yield client_1.default.chat.create({
                data: {
                    userEmail: email,
                    userMessage: message,
                    senderUserId: id,
                    receiverUserId: recieversData === null || recieversData === void 0 ? void 0 : recieversData.id,
                    isReceivedStatus: true,
                    user: {
                        connect: {
                            id: recieversData === null || recieversData === void 0 ? void 0 : recieversData.id,
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
        else {
            res.json({ response: "reciever does not exist ", status: false });
        }
    }
    catch (_l) {
        res.json({ response: "server issue occured", status: false });
    }
});
exports.usersChat = usersChat;
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
const collaboratingUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _m;
    try {
        const { id } = req.user;
        const { docid, docname, roomId, collabUsersEmail } = (req.body);
        const getCollaboratingUsers = yield client_1.default.collaboratingUsers.findFirst({
            where: {
                docid: docid,
                roomId: roomId,
            },
            select: {
                collabNumber: true,
            },
        });
        if (getCollaboratingUsers !== undefined &&
            (getCollaboratingUsers === null || getCollaboratingUsers === void 0 ? void 0 : getCollaboratingUsers.collabNumber) == 0) {
            const collabData = yield client_1.default.collaboratingUsers.create({
                data: {
                    collabNumber: collabUsersEmail === null || collabUsersEmail === void 0 ? void 0 : collabUsersEmail.length,
                    docid: docid,
                    docname: docname,
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
        }
        else if ((getCollaboratingUsers === null || getCollaboratingUsers === void 0 ? void 0 : getCollaboratingUsers.collabNumber) != undefined &&
            (getCollaboratingUsers === null || getCollaboratingUsers === void 0 ? void 0 : getCollaboratingUsers.collabNumber) > 0 &&
            (getCollaboratingUsers === null || getCollaboratingUsers === void 0 ? void 0 : getCollaboratingUsers.collabNumber) <= MAX_COLLABORATORS) {
            const findUpdate = yield client_1.default.collaboratingUsers.findFirst({
                where: {
                    docid: docid,
                    roomId: roomId,
                },
            });
            const updatesUsers = yield ((_m = client_1.default.collaboratingUsers) === null || _m === void 0 ? void 0 : _m.update({
                where: {
                    id: findUpdate === null || findUpdate === void 0 ? void 0 : findUpdate.id,
                },
                data: {
                    collabNumber: collabUsersEmail === null || collabUsersEmail === void 0 ? void 0 : collabUsersEmail.length,
                    collabUsersEmail: collabUsersEmail,
                },
            }));
            res.json({
                response: updatesUsers,
                status: true,
                message: "user email added as doc collaborator",
            });
        }
        else {
            res.json({
                message: "collaborating users reached maximum.Collaboration for this document is closed",
                status: false,
            });
        }
    }
    catch (_o) {
        res.json({ response: "server issue occured", status: false });
    }
});
exports.collaboratingUsers = collaboratingUsers;
const getRoomCollaborators = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.body;
        const roomdata = yield client_1.default.collaboratingUsers.findFirst({
            where: {
                roomId: roomId,
            },
        });
        if ((roomdata === null || roomdata === void 0 ? void 0 : roomdata.id) !== undefined) {
            res.json({ response: roomdata, status: true });
        }
        else {
            res.json({
                response: roomdata,
                statu: false,
                message: "no such room found",
            });
        }
    }
    catch (_p) {
        res.json({ response: "server issue occured", status: false });
    }
});
exports.getRoomCollaborators = getRoomCollaborators;
const getChatMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const { id } = req.user;
    try {
        const receiverData = yield client_1.default.user.findFirst({
            where: { email: email },
        });
        if ((receiverData === null || receiverData === void 0 ? void 0 : receiverData.id) != null) {
            const sentMessages = yield client_1.default.chat.findMany({
                where: {
                    senderUserId: id,
                    receiverUserId: receiverData.id,
                },
            });
            const receiversMessages = yield client_1.default.chat.findMany({
                where: {
                    senderUserId: receiverData.id,
                    receiverUserId: id,
                },
            });
            res.json({
                sentMessages: sentMessages,
                recieveMessages: receiversMessages,
                status: true,
            });
        }
        else {
            res.json({
                response: `no such user with email ${email} exist `,
                status: false,
            });
        }
    }
    catch (_q) {
        res.json({ response: "server issue occured", status: false });
    }
});
exports.getChatMessage = getChatMessage;
