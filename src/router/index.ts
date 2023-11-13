import express, { Express, Request, Response , NextFunction } from 'express';
import { userOnboarding ,  homePage , userLogin  , userRecoverPassword ,searchUsersByEmail , adminUploadTemplates , getAllTemplates} from '../controllers';
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
router.route("/login").post(userLogin)
router.route("/useronboarding").post(userOnboarding)
router.route("/passwordrecovery").post(userRecoverPassword)


router.route("/getTemplates").get(getAllTemplates)
router.use(VerifiedAuthToken);
router.route('/searchuserbyemail').post(searchUsersByEmail)
router.route("/uploadsingletemplates").post(upload,adminUploadTemplates)

export default router ; 
