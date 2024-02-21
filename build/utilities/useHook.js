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
exports.getFileFromPath = exports.searchFileInFolder = exports.removeFile = exports.getDecryptFile = exports.getEncryptFile = exports.getFileName = exports.getFolderPath = exports.getAbsolutePath = exports.getChatNotifier = exports.verifyUserAuth = exports.usersAuth = exports.hashPass = exports.generateSalt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const generateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.genSalt();
});
exports.generateSalt = generateSalt;
const hashPass = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, salt);
});
exports.hashPass = hashPass;
const usersAuth = (userRegisterData) => __awaiter(void 0, void 0, void 0, function* () {
    const authResponse = yield jsonwebtoken_1.default.sign(userRegisterData, config_1.AUTH_SECRET_KEY, { expiresIn: "1d" });
    return authResponse;
});
exports.usersAuth = usersAuth;
const verifyUserAuth = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.get("Authorization");
    const verifiedToken = yield jsonwebtoken_1.default.verify(token === null || token === void 0 ? void 0 : token.split(' ')[1], config_1.AUTH_SECRET_KEY);
    if (verifiedToken) {
        req.user = verifiedToken;
        return true;
    }
});
exports.verifyUserAuth = verifyUserAuth;
const getChatNotifier = (usersChatData) => __awaiter(void 0, void 0, void 0, function* () {
    return usersChatData.filter((usersChat) => (usersChat === null || usersChat === void 0 ? void 0 : usersChat.isReceivedStatus) == false);
});
exports.getChatNotifier = getChatNotifier;
const getAbsolutePath = (LinkPathDots, parentFolder, folderName, fileName) => {
    return path_1.default.join(path_1.default.resolve(__dirname, LinkPathDots, parentFolder, folderName), fileName);
};
exports.getAbsolutePath = getAbsolutePath;
const getFolderPath = (LinkPathDots, parentFolder, folderName) => {
    return path_1.default.resolve(__dirname, LinkPathDots, parentFolder, folderName);
};
exports.getFolderPath = getFolderPath;
const getFileName = (filenameWithExtension) => {
    return path_1.default.basename(filenameWithExtension, path_1.default.extname(filenameWithExtension));
};
exports.getFileName = getFileName;
const getEncryptFile = (inputPath, outputPath, password) => {
    try {
        const algorithm = 'aes-256-cbc';
        const salt = "bluedil-xxxxxxx-generate-salt-2024";
        const key = crypto_1.default.scryptSync(password, salt, 32);
        const iv = crypto_1.default.randomBytes(16);
        const cipher = crypto_1.default.createCipheriv(algorithm, key, iv);
        const input = fs_1.default.createReadStream(inputPath);
        const output = fs_1.default.createWriteStream(outputPath);
        output.write(iv);
        const pipeOutput = input.pipe(cipher).pipe(output);
        return output.path;
    }
    catch (error) {
        console.error('Error encrypting file:', error);
    }
};
exports.getEncryptFile = getEncryptFile;
const getDecryptFile = (inputPath, outputPath, password) => {
    try {
        const algorithm = 'aes-256-cbc';
        const salt = "bluedil-xxxxxxx-generate-salt-2024";
        const key = crypto_1.default.scryptSync(password, salt, 32);
        const input = fs_1.default.createReadStream(inputPath);
        const output = fs_1.default.createWriteStream(outputPath);
        let iv;
        const pipeOutput = input.once('readable', () => {
            iv = input.read(16);
            const decipher = crypto_1.default.createDecipheriv(algorithm, key, iv);
            input.pipe(decipher).pipe(output);
        });
        return { output };
    }
    catch (error) {
        console.error('Error decrypting file:', error);
    }
};
exports.getDecryptFile = getDecryptFile;
const removeFile = (filePath) => {
    fs_1.default.unlink(filePath, (err) => {
        if (err) {
            return `Error removing file: ${err}`;
        }
        return `${filePath} has been removed successfully.`;
    });
};
exports.removeFile = removeFile;
const searchFileInFolder = (folderPath, fileName) => {
    const arr = fs_1.default.readdir(folderPath, (err, files) => files);
    return arr;
};
exports.searchFileInFolder = searchFileInFolder;
const getFileFromPath = (path) => path.split('/')[path.length - 1];
exports.getFileFromPath = getFileFromPath;
