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
exports.generatePassword = exports.decryptFile = exports.encryptFile = exports.fileConverter = exports.getAllDocument = exports.updateDocument = exports.updateChatNotification = exports.getChatNotification = exports.userLoginByEmail = exports.getChatMessage = exports.getCollaboratorDocs = exports.addCollaborators = exports.createCollaboration = exports.usersChat = exports.getAllTemplates = exports.adminUploadTemplates = exports.searchUsersByEmail = exports.userRecoverPassword = exports.userLogin = exports.googleOnboarding = exports.userOnboarding = exports.homePage = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const useHook_1 = require("../utilities/useHook");
const client_1 = __importDefault(require("../model/prismaClient/client"));
const promises_1 = __importDefault(require("fs/promises"));
const convertapi_1 = __importDefault(require("convertapi"));
const convertapi = new convertapi_1.default("r0ps82oFwtrDLyGO", {
    conversionTimeout: 60,
});
const cryptify_1 = __importDefault(require("cryptify"));
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
    catch (_g) {
        res.json({ response: "error occured", status: false });
    }
});
exports.userLogin = userLogin;
const userRecoverPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    try {
        const { email } = req.body;
        const usersRecoveryData = yield ((_h = client_1.default.user) === null || _h === void 0 ? void 0 : _h.findFirst({
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
    catch (_j) {
        res.json({ response: "error occured", status: false });
    }
});
exports.userRecoverPassword = userRecoverPassword;
const searchUsersByEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    try {
        const { email } = req.body;
        const searchUsersData = yield ((_k = client_1.default.user) === null || _k === void 0 ? void 0 : _k.findFirst({
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
    catch (_l) {
        res.json({ response: "error occured", status: false });
    }
});
exports.searchUsersByEmail = searchUsersByEmail;
const adminUploadTemplates = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _m;
    try {
        const { docid, docname, templateType } = req.body;
        const { id } = req.user;
        const fileupload = req.file;
        const filename = fileupload.filename;
        let updateTemplate = yield ((_m = client_1.default.document) === null || _m === void 0 ? void 0 : _m.create({
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
    var _o;
    try {
        const allDocuments = yield ((_o = client_1.default.document) === null || _o === void 0 ? void 0 : _o.findMany());
        res.json({ response: allDocuments, status: true });
    }
    catch (err) {
        res.json({ response: "server issue occured", status: false });
    }
});
exports.getAllTemplates = getAllTemplates;
const usersChat = (req, res, nexr) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { id, email } = <IRegistration>req.user;
        const { sendersEmail, receiversemail, message } = req.body;
        const recieversData = yield client_1.default.user.findFirst({
            where: { email: receiversemail },
        });
        const senderData = yield client_1.default.user.findFirst({
            where: { email: sendersEmail },
        });
        if ((recieversData === null || recieversData === void 0 ? void 0 : recieversData.id) != null) {
            const chatusers = yield client_1.default.chat.create({
                data: {
                    userEmail: sendersEmail,
                    userMessage: message,
                    senderUserId: senderData === null || senderData === void 0 ? void 0 : senderData.id,
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
    catch (_p) {
        res.json({ response: "server issue occured", status: false });
    }
});
exports.usersChat = usersChat;
const createCollaboration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { docId, docName, roomId } = req.body;
    try {
        const collab = yield client_1.default.collaborateDocs.findFirst({
            where: {
                roomId: roomId,
                docid: docId,
            },
        });
        if (collab == null) {
            const collabCreated = yield client_1.default.collaborateDocs.create({
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
        }
        else {
            res.json({
                response: "Document Collaboration creation failed. Collaboration already exist",
                status: false,
            });
        }
    }
    catch (err) {
        res.json({ response: "server Error occured", status: false, error: err });
    }
});
exports.createCollaboration = createCollaboration;
const addCollaborators = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _q;
    try {
        // add collaborators
        const { roomId, collabUsersEmail } = req.body;
        const isCollaboratorsAvailable = yield client_1.default.collaborateDocs.findFirst({
            where: { roomId: roomId }
        });
        if ((isCollaboratorsAvailable === null || isCollaboratorsAvailable === void 0 ? void 0 : isCollaboratorsAvailable.id) != undefined) {
            const hasApprovedCollaborators = yield client_1.default.collaborator.findMany({
                where: {
                    collabId: isCollaboratorsAvailable === null || isCollaboratorsAvailable === void 0 ? void 0 : isCollaboratorsAvailable.id
                }
            });
            const findCollaborator = hasApprovedCollaborators.filter((collabData, index) => ((collabData === null || collabData === void 0 ? void 0 : collabData.collaboratorEmail) == collabUsersEmail));
            if ((hasApprovedCollaborators.length < MAX_COLLABORATORS)) {
                if (findCollaborator.length > 0) {
                    res.json({ collaboratingDocs: isCollaboratorsAvailable,
                        collaborator: findCollaborator, message: "user is already a collaborator" });
                    return;
                }
                const joinCollaborators = yield ((_q = client_1.default === null || client_1.default === void 0 ? void 0 : client_1.default.collaborator) === null || _q === void 0 ? void 0 : _q.create({
                    data: {
                        collaboratorEmail: String(collabUsersEmail),
                        isSigned: false,
                        collabId: isCollaboratorsAvailable === null || isCollaboratorsAvailable === void 0 ? void 0 : isCollaboratorsAvailable.id,
                    },
                }));
                res.json({
                    collaboratingDocs: isCollaboratorsAvailable,
                    collaborator: joinCollaborators,
                    previousCollaborators: hasApprovedCollaborators,
                    status: true,
                    message: "User is added to Doc Collaboration",
                });
            }
            else {
                res.json({
                    collaboratingDocs: isCollaboratorsAvailable,
                    previousCollaborators: hasApprovedCollaborators,
                    status: true,
                    message: `Collaboration for this document ${isCollaboratorsAvailable.id} has reached maximum`,
                });
            }
        }
        else {
            res.json({
                message: "No such Document to collaborate.",
            });
        }
    }
    catch (err) {
        res.json({ response: "server Error occured", status: false, error: err });
    }
});
exports.addCollaborators = addCollaborators;
const getCollaboratorDocs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.body;
        const collabDocs = yield client_1.default.collaborateDocs.findFirst({
            where: {
                roomId: roomId,
            },
        });
        if ((collabDocs === null || collabDocs === void 0 ? void 0 : collabDocs.id) != undefined) {
            const documentCollaborators = yield client_1.default.collaborator.findMany({
                where: {
                    collabId: collabDocs.id
                }
            });
            res.json({
                collaboratingDocuments: collabDocs,
                collaborators: documentCollaborators,
                status: true,
                message: "Collaboration Document found",
            });
        }
        else {
            res.json({ message: "Collaboration Document Not found", status: false });
        }
    }
    catch (err) {
        res.json({ response: "server Error occured", status: false, error: err });
    }
});
exports.getCollaboratorDocs = getCollaboratorDocs;
const getChatMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { sendersEmail, recieversEmail } = req.body;
    // const { id } = req.user;
    try {
        const receiverData = yield client_1.default.user.findFirst({
            where: { email: recieversEmail },
        });
        const senderData = yield client_1.default.user.findFirst({
            where: { email: sendersEmail },
        });
        if ((receiverData === null || receiverData === void 0 ? void 0 : receiverData.id) != null && (senderData === null || senderData === void 0 ? void 0 : senderData.id) != null) {
            const sentMessages = yield client_1.default.chat.findMany({
                where: {
                    userEmail: sendersEmail,
                    receiverUserId: receiverData === null || receiverData === void 0 ? void 0 : receiverData.id,
                },
            });
            const receiversMessages = yield client_1.default.chat.findMany({
                where: {
                    userEmail: recieversEmail,
                    receiverUserId: senderData === null || senderData === void 0 ? void 0 : senderData.id,
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
                response: `no such user with email ${recieversEmail} exist `,
                status: false,
            });
        }
    }
    catch (_r) {
        res.json({ response: "server issue occured", status: false });
    }
});
exports.getChatMessage = getChatMessage;
const userLoginByEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const usersLoginResponseByEmail = yield client_1.default.user.findFirst({
            where: {
                email: email,
            },
        });
        if (usersLoginResponseByEmail) {
            const tokenAuth = yield (0, useHook_1.usersAuth)(usersLoginResponseByEmail);
            if (tokenAuth) {
                res.json({
                    authToken: tokenAuth,
                    status: true,
                    response: usersLoginResponseByEmail,
                });
            }
        }
        else {
            res.json({ response: "user not found ", status: false });
        }
    }
    catch (_s) {
        res.json({ response: "error occured", status: false });
    }
});
exports.userLoginByEmail = userLoginByEmail;
const getChatNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiverUserId } = req.body;
    // const { id } = req.user;
    try {
        const receiverData = yield client_1.default.chat.findMany({
            where: { receiverUserId: receiverUserId, isReceivedStatus: false },
        });
        if (receiverData.length != 0) {
            let userNotify = yield (0, useHook_1.getChatNotifier)(receiverData);
            res.json({
                response: userNotify,
                message: "users notification",
            });
        }
        else {
            res.json({
                response: [],
                message: "No Notification for User",
            });
        }
    }
    catch (_t) {
        res.json({ response: "server issue occured", status: false });
    }
});
exports.getChatNotification = getChatNotification;
const updateChatNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.body;
    // const { id } = req.user;
    try {
        const receiverData = yield client_1.default.chat.update({
            where: {
                id: chatId,
            },
            data: {
                isReceivedStatus: true,
            },
        });
        if ((receiverData === null || receiverData === void 0 ? void 0 : receiverData.id) != null) {
            res.json({
                response: receiverData,
                message: `users notification with id ${receiverData.id} was updated successfully `,
            });
        }
        else {
            res.json({
                response: false,
                message: `users notification with id ${chatId} failed`,
            });
        }
    }
    catch (_u) {
        res.json({ response: "server issue occured", status: false });
    }
});
exports.updateChatNotification = updateChatNotification;
const updateDocument = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { docid, docname, doclink, userUpdateDoc, templateType, isEncrypted, securityCode, docformat, } = req.body;
        const docData = yield client_1.default.document.update({
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
        }
        else {
            res.json({
                response: docData,
                message: `Document update failed `,
            });
        }
    }
    catch (err) {
        res.json({ response: "server issue occured", status: false });
    }
});
exports.updateDocument = updateDocument;
const getAllDocument = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allDocs = yield client_1.default.document.findMany();
        if (allDocs.length != 0) {
            res.json({
                response: allDocs,
                message: `All templates collected successfully `,
            });
        }
        else {
            res.json({
                response: allDocs,
                message: `Template Collection failed `,
            });
        }
    }
    catch (err) {
        res.json({ response: "server issue occured", status: false });
    }
});
exports.getAllDocument = getAllDocument;
const fileConverter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { convertFormat } = req.body;
        const fileupload = req.file;
        const filename = fileupload.filename;
        const filenameWithoutExt = (0, useHook_1.getFileName)(filename);
        const fileLink = (0, useHook_1.getAbsolutePath)("../..", "src", "convertedFiles", filename);
        const outputPath = (0, useHook_1.getAbsolutePath)("../..", "src", "convertedFiles/fileConversionOutput", filenameWithoutExt + "." + convertFormat);
        const result = yield convertapi
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
    }
    catch (err) {
        res.json({ message: "server error occured", status: false, error: err });
    }
});
exports.fileConverter = fileConverter;
const encryptFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const password = "mz2@P3+D*%?{9CPY!ibyk?wrtmopK}";
        const { password } = req.body;
        if (password !== null) {
            const fileupload = req.file;
            const filename = fileupload.filename;
            const fileLink = (0, useHook_1.getAbsolutePath)("../..", "src", "encrypt", filename);
            const outputPath = (0, useHook_1.getAbsolutePath)("../..", "src", "encrypt/encryptOutput", "encoded-" + filename);
            const cryptifyResponse = new cryptify_1.default(fileLink, password);
            cryptifyResponse
                .encrypt()
                .then((files) => __awaiter(void 0, void 0, void 0, function* () {
                /* Do stuff */
                if (files == undefined)
                    return;
                promises_1.default.writeFile(outputPath, files[0]);
                const encryptionData = yield client_1.default.docsEncryption.create({
                    data: {
                        decryptionLink: fileLink,
                        encryptionLink: outputPath,
                        encryptionPassword: password,
                    },
                    select: {
                        decryptionLink: true,
                        encryptionPassword: true
                    }
                });
                res.json({
                    response: encryptionData,
                    status: true,
                    password: password,
                    message: "file successfully encrypted",
                });
            }))
                .catch((e) => res.json({ response: e, status: false, message: "encryption failed" }));
        }
        else {
            res.json({ status: false, message: "Password is missing" });
        }
    }
    catch (err) {
        res.json({ message: "server error occured", status: false, error: err });
    }
});
exports.encryptFile = encryptFile;
const decryptFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { decryptFileName, password } = req.body;
        const fileLink = (0, useHook_1.getAbsolutePath)("../..", "src", "encrypt/encryptOutput", decryptFileName);
        const decryptionData = yield client_1.default.docsEncryption.findFirst({
            where: {
                encryptionLink: fileLink
            },
            select: {
                decryptionLink: true,
                encryptionPassword: true,
            }
        });
        if ((decryptionData === null || decryptionData === void 0 ? void 0 : decryptionData.encryptionPassword) != password) {
            res.json({ message: "password is not correct ", status: false });
        }
        if (((decryptionData === null || decryptionData === void 0 ? void 0 : decryptionData.encryptionPassword) == password) && ((decryptionData === null || decryptionData === void 0 ? void 0 : decryptionData.decryptionLink) != undefined)) {
            res.json({ response: decryptionData, message: "decryption successfull", status: true });
        }
        if ((decryptionData === null || decryptionData === void 0 ? void 0 : decryptionData.decryptionLink) == undefined) {
            res.json({ message: "encryption Link not available ", status: false });
        }
    }
    catch (err) {
        res.json({ message: "server error occured", status: false, error: err });
    }
});
exports.decryptFile = decryptFile;
const generatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let length = req.params.length;
        const passwordGenerate = (0, useHook_1.generateUsersPassword)(Number(length));
        const hasGenerated = yield client_1.default.generatePassword.findMany({
            where: {
                password: passwordGenerate
            }
        });
        if (hasGenerated.length > 0) {
            const passwordNewPassword = (0, useHook_1.generateUsersPassword)(Number(length));
            client_1.default.generatePassword.create({
                data: {
                    password: passwordNewPassword
                }
            });
            res.json({ response: passwordNewPassword, message: "password already exist but new user password is generated" });
        }
        else {
            client_1.default.generatePassword.create({
                data: {
                    password: passwordGenerate
                }
            });
            res.json({ response: passwordGenerate, message: "password generated" });
        }
    }
    catch (err) {
        res.json({ message: "server error occured", status: false, error: err });
    }
});
exports.generatePassword = generatePassword;
