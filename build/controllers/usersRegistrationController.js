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
exports.getAllTemplates = exports.adminUploadTemplates = exports.searchUsersByEmail = exports.userRecoverPassword = exports.userLogin = exports.userOnboarding = exports.homePage = void 0;
const useHook_1 = require("../utilities/useHook");
const client_1 = __importDefault(require("../model/prismaClient/client"));
const ClassValidation_1 = require("../dto/ClassValidation");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const homePage = (req, res) => {
    res.json({ message: "running successfully" });
};
exports.homePage = homePage;
const userOnboarding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(req.body);
    try {
        const salt = yield (0, useHook_1.generateSalt)();
        const validatedData = (0, class_transformer_1.plainToClass)(ClassValidation_1.ClassValidation, req.body);
        const validationResult = yield (0, class_validator_1.validate)(validatedData, { validationError: { target: true } });
        if (validationResult.length !== 0) {
            return res.status(400).json(validationResult);
        }
        const { email, firstname, lastname, password, company } = validatedData;
        const userConfiguration = { email, firstname, lastname, password, company };
        //    const userAuthToken  = await usersAuth(userConfiguration , salt);
        const genSalt = yield (0, useHook_1.generateSalt)();
        const hashpassword = yield (0, useHook_1.hashPass)(password, genSalt);
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
        if (userReponse) {
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
    const { email, password } = req.body;
    // const auth = req.get("Authorization");
    try {
        const usersLoginResponse = yield client_1.default.user.findFirst({
            where: {
                email: email,
                password: password,
            }
        });
        if (usersLoginResponse) {
            const tokenAuth = yield (0, useHook_1.usersAuth)(usersLoginResponse);
            if (tokenAuth) {
                res.json({ authToken: tokenAuth, status: true, response: usersLoginResponse });
            }
        }
        res.json({ response: "user login not successful", status: false });
    }
    catch (_d) {
        res.json({ response: "error occured", status: false });
    }
});
exports.userLogin = userLogin;
const userRecoverPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const { email } = req.body;
    try {
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
        res.json({ message: "user not found", status: false, user: usersRecoveryData });
    }
    catch (_f) {
        res.json({ response: "error occured", status: false });
    }
});
exports.userRecoverPassword = userRecoverPassword;
const searchUsersByEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const { email } = req.body;
    try {
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
        res.json({ message: "user not found", status: false, user: searchUsersData });
    }
    catch (_h) {
        res.json({ response: "error occured", status: false });
    }
});
exports.searchUsersByEmail = searchUsersByEmail;
const adminUploadTemplates = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    const { docid, docname, templateType } = req.body;
    const { id } = req.user;
    const fileupload = req.file;
    const filename = fileupload.filename;
    try {
        let updateTemplate = yield ((_j = client_1.default.document) === null || _j === void 0 ? void 0 : _j.create({
            data: {
                docid: docid,
                docname: docname,
                doclink: filename,
                userUpdateDoc: id,
                templateType: templateType,
            }
        }));
        if (updateTemplate) {
            res.json({ response: "template added successfully", status: true });
        }
        res.json({ response: "something went wrong", status: false });
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
