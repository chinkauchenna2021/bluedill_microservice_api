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
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const companyEmail = process.env.COMPANY_EMAIL;
const companyUser = process.env.EMAIL_USER;
const companyPassword = process.env.EMAIL_PASSWORD;
const mailPort = process.env.EMAIL_PORT;
const mailHost = process.env.MAIL_HOST;
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
            secure: 'SSL', // use SSL - TLS
            auth: {
                user: companyUser,
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
