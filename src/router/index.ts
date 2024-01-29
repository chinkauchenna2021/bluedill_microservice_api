import express, { Express, Request, Response , NextFunction } from 'express';
import Cors from 'cors'
import { userOnboarding ,  homePage , userLogin  , userRecoverPassword ,searchUsersByEmail , adminUploadTemplates , getAllTemplates, usersChat, getChatMessage, collaboratingUsers, getRoomCollaborators , userLoginByEmail, getChatNotification, updateChatNotification, getAllDocument, updateDocument} from '../controllers';
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
      cb(null, file.originalname+ '-' + uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage }).array("template");



router.get('/' , homePage);
router.get("/getTemplates" , getAllTemplates);
router.post("/login",userLogin);
router.post("/loginbymail",userLoginByEmail)
router.post("/useronboarding" , userOnboarding);
router.post("/passwordrecovery",userRecoverPassword);

// router.use(VerifiedAuthToken);
router.post('/searchuserbyemail' , searchUsersByEmail);
router.post("/uploadsingletemplates",upload,adminUploadTemplates);
router.post("/chatusers" , usersChat);
router.post("/usersmessages" , getChatMessage)
// router.post("/getsendermessages",getUserMessagesToReceiver);
// router.post("/getreceiversmessages" , getReceiversMessagesFromSender);
router.post('/createandaddcollaboration' , collaboratingUsers);
router.post("/getroomdata",getRoomCollaborators)
router.post("/getNotification" , getChatNotification) 
router.post("updateNotification" , updateChatNotification);
router.get("/getAllDocs",getAllDocument);
router.post("/updateDocs",updateDocument)

export default router ; 
