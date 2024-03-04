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
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const fileConvert = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/convertedFiles/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const encryptFiles = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/encrypt/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage }).array("template");
const singleFileConvert = (0, multer_1.default)({
    storage: fileConvert
}).single('convert');
const encryptStorage = (0, multer_1.default)({
    storage: encryptFiles
}).single('encrypt');
router.get('/', controllers_1.homePage);
router.get("/getTemplates", controllers_1.getAllTemplates);
router.post("/login", controllers_1.userLogin);
router.post("/loginbymail", controllers_1.userLoginByEmail);
router.post("/useronboarding", controllers_1.userOnboarding);
router.post("/passwordrecovery", controllers_1.userRecoverPassword);
// router.use(VerifiedAuthToken);
router.post('/searchuserbyemail', controllers_1.searchUsersByEmail);
router.post("/uploadsingletemplates", upload, controllers_1.adminUploadTemplates);
router.post("/chatusers", controllers_1.usersChat);
router.post("/usersmessages", controllers_1.getChatMessage);
// router.post("/getsendermessages",getUserMessagesToReceiver);
// router.post("/getreceiversmessages" , getReceiversMessagesFromSender);
router.post('/createCollaboration', controllers_1.createCollaboration);
router.post("/addCollaborators", controllers_1.addCollaborators);
router.post("/getNotification", controllers_1.getChatNotification);
router.post("/getCollabDocsById", controllers_1.getCollaboratorDocs);
router.post("updateNotification", controllers_1.updateChatNotification);
router.get("/getAllDocs", controllers_1.getAllDocument);
router.post("/updateDocs", controllers_1.updateDocument);
// encryptFile
router.post("/fileconverter", singleFileConvert, controllers_1.fileConverter);
router.post("/encryptFile", encryptStorage, controllers_1.encryptFile);
router.post("/decryptFile", controllers_1.decryptFile);
router.get("/generatePassword/:length", controllers_1.generatePassword);
exports.default = router;
