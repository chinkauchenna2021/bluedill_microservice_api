import express, { Express, Request, Response , NextFunction } from 'express';
import { userOnboarding ,  homePage , userLogin  , userRecoverPassword ,searchUsersByEmail , adminUploadTemplates , getAllTemplates, usersChat} from '../controllers';
import multer from 'multer';
import { verfyAuthToken as VerifiedAuthToken } from '../middleware/verifyAuth';

const router = express.Router()

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



router.route('/').get(homePage)
router.get("/getTemplates" , getAllTemplates)
router.post("/login",userLogin)
router.post("/useronboarding" , userOnboarding)
router.post("/passwordrecovery",userRecoverPassword)

router.use(VerifiedAuthToken);
router.post('/searchuserbyemail' , searchUsersByEmail)
router.post("/uploadsingletemplates",upload,adminUploadTemplates)
router.post("/chatusers" , usersChat);

export default router ; 
