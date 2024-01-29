import nodemailer from "nodemailer";
// import {config} from 'dotenv';
// config();
// const yourEmail = "yourEmail@gmail.com";
// const yourPass = "yourEmailPasswrd";
// const mailHost = "smpt.gmail.com";
// const mailPort = 587;
// const senderEmail = "senderEmail@gmail.com"

const companyEmail= "";
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
export  async function sendMailWithNodeMailer(to:string, subject:string , htmlContent:any) {
  let transporter = nodemailer.createTransport({
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
};