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
exports.sendMailWithNodeMailer = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// import {config} from 'dotenv';
// config();
// const yourEmail = "yourEmail@gmail.com";
// const yourPass = "yourEmailPasswrd";
// const mailHost = "smpt.gmail.com";
// const mailPort = 587;
// const senderEmail = "senderEmail@gmail.com"
const companyEmail = "";
const companyPassword = "";
const mailPort = 0;
const mailHost = "";
/**
 * Send mail
 * @param {string} to
 * @param {string} subject
 * @param {string[html]} htmlContent
 * @returns
 */
function sendMailWithNodeMailer(to, subject, htmlContent) {
    return __awaiter(this, void 0, void 0, function* () {
        let transporter = nodemailer_1.default.createTransport({
            host: mailHost,
            port: mailPort,
            secure: false, // use SSL - TLS
            auth: {
                user: companyEmail,
                pass: companyPassword,
            },
        });
        let mailOptions = {
            from: companyEmail,
            to: to,
            subject: subject,
            html: htmlContent,
        };
        return transporter.sendMail(mailOptions); // promise
    });
}
exports.sendMailWithNodeMailer = sendMailWithNodeMailer;
;
