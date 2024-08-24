import express, { Express, Request, Response , NextFunction } from 'express';
import Cors from 'cors'
import {
  userOnboarding,
  homePage,
  userLogin,
  userRecoverPassword,
  searchUsersByEmail,
  adminUploadTemplates,
  getAllTemplates,
  usersChat,
  getChatMessage,
  createCollaboration,
  addCollaborators,
  getCollaboratorDocs,
  userLoginByEmail,
  getChatNotification,
  updateChatNotification,
  getAllDocument,
  updateDocument,
  fileConverter,
  encryptFile,
  decryptFile,
  generatePassword,
  updatePassword
} from "../controllers";
import multer from 'multer';
import { verfyAuthToken as VerifiedAuthToken } from '../middleware/verifyAuth';

const router = express.Router()


router.use(Cors())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,uniqueSuffix+ '-' +  file.originalname)
    }
  })
  

  const fileConvert = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/convertedFiles/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,uniqueSuffix+ '-' +  file.originalname)
    }
  })


  const encryptFiles = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/encrypt/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,uniqueSuffix+ '-' +  file.originalname)
    }
  })


  const upload = multer({ storage: storage }).array("template");

  const singleFileConvert = multer({
    storage: fileConvert
  }).single('convert');

  const encryptStorage = multer({
    storage: encryptFiles
  }).single('encrypt');



router.get('/' , homePage);
router.get("/getTemplates" , getAllTemplates);
router.post("/login",userLogin);
router.post("/loginbymail",userLoginByEmail)
router.post("/useronboarding" , userOnboarding);
router.post("/passwordrecovery",userRecoverPassword);
router.patch("/updatepassword",updatePassword);

// router.use(VerifiedAuthToken);
router.post('/searchuserbyemail' , searchUsersByEmail);
router.post("/uploadsingletemplates",upload,adminUploadTemplates);
router.post("/chatusers" , usersChat);
router.post("/usersmessages" , getChatMessage)
// router.post("/getsendermessages",getUserMessagesToReceiver);
// router.post("/getreceiversmessages" , getReceiversMessagesFromSender);
router.post('/createCollaboration' , createCollaboration);
router.post("/addCollaborators",addCollaborators)
router.post("/getNotification" , getChatNotification) 
router.post("/getCollabDocsById" ,getCollaboratorDocs)
router.post("updateNotification" , updateChatNotification);
router.get("/getAllDocs",getAllDocument);
router.post("/updateDocs",updateDocument);
// encryptFile
router.post("/fileconverter",singleFileConvert,fileConverter)
router.post("/encryptFile",encryptStorage,encryptFile)
router.post("/decryptFile",decryptFile)
router.get("/generatePassword/:length", generatePassword);
export default router ; 
