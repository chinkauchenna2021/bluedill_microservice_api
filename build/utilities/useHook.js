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
exports.verifyUserAuth = exports.usersAuth = exports.hashPass = exports.generateSalt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const generateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.genSalt();
});
exports.generateSalt = generateSalt;
const hashPass = (password, salt) => {
    return bcrypt_1.default.hash(password, salt);
};
exports.hashPass = hashPass;
const usersAuth = (userRegisterData) => __awaiter(void 0, void 0, void 0, function* () {
    const authResponse = jsonwebtoken_1.default.sign(userRegisterData, config_1.AUTH_SECRET_KEY, { expiresIn: "1d" });
    return authResponse;
});
exports.usersAuth = usersAuth;
const verifyUserAuth = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.get("Authorization");
    const verifiedToken = jsonwebtoken_1.default.verify(token === null || token === void 0 ? void 0 : token.split(' ')[1], config_1.AUTH_SECRET_KEY);
    if (verifiedToken !== null) {
        req.user = verifiedToken;
        return true;
    }
});
exports.verifyUserAuth = verifyUserAuth;
