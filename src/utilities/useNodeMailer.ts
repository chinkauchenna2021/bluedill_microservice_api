import nodemailer from "nodemailer";
import {config} from 'dotenv';
config();

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
export  async function sendMailWithNodeMailer(to:string, subject:string , htmlContent:any) {
  let transporter = nodemailer.createTransport({
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
};