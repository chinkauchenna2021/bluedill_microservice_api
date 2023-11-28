"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const controllers_1 = require("../controllers");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
router.use((0, cors_1.default)());
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.originalname + '-' + uniqueSuffix);
    }
});
const upload = (0, multer_1.default)({ storage: storage }).array("template");
router.get('/', controllers_1.homePage);
router.get("/getTemplates", controllers_1.getAllTemplates);
router.post("/login", controllers_1.userLogin);
router.post("/useronboarding", controllers_1.userOnboarding);
router.post("/passwordrecovery", controllers_1.userRecoverPassword);
// router.use(VerifiedAuthToken);
router.post('/searchuserbyemail', controllers_1.searchUsersByEmail);
router.post("/uploadsingletemplates", upload, controllers_1.adminUploadTemplates);
router.post("/chatusers", controllers_1.usersChat);
router.post("/usersmessages", controllers_1.getChatMessage);
// router.post("/getsendermessages",getUserMessagesToReceiver);
// router.post("/getreceiversmessages" , getReceiversMessagesFromSender);
router.post('/createandaddcollaboration', controllers_1.collaboratingUsers);
router.post("/getroomdata", controllers_1.getRoomCollaborators);
exports.default = router;
