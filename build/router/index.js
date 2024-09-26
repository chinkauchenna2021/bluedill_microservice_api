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
        cb(null, "images");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
const fileConvert = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/convertedFiles/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
const encryptFiles = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/encrypt/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage }).array("template");
const singleFileConvert = (0, multer_1.default)({
    storage: fileConvert,
}).single("convert");
const encryptStorage = (0, multer_1.default)({
    storage: encryptFiles,
}).single("encrypt");
router.get("/", controllers_1.homePage);
// router.get("/getTemplates" , getAllTemplates);
router.post("/login", controllers_1.userLogin);
// router.post("/loginwithmail",userLoginByEmail)
router.post("/useronboarding", controllers_1.userOnboarding);
router.post("/passwordrecovery", controllers_1.userRecoverPassword);
router.patch("/updatepassword", controllers_1.updatePassword);
// router.use(VerifiedAuthToken);
router.post("/searchuserbyemail", controllers_1.searchUsersByEmail);
router.post("/createdocument", controllers_1.createDocument);
router.patch("/addcollaborator", controllers_1.addCollaborator);
router.post("/requestsignature", controllers_1.requestSignature);
router.patch("/togglecollaboration", controllers_1.toggleCollaboration);
router.patch("/removecollaborator", controllers_1.removeCollaborator);
router.post("/generateDocumentlink", controllers_1.generateDocumentLink);
router.get("/getnotification", controllers_1.getNotifications); // this uses get params
router.get("/gettempletes", controllers_1.getContractTemplates);
router.patch("/signdocument", controllers_1.signDocument);
router.patch("/updatedocument", controllers_1.updateDocument);
// router.post("/uploadsingletemplates",upload,adminUploadTemplates);
// router.post("/chatusers" , usersChat);
// router.post("/usersmessages" , getChatMessage)
// // router.post("/getsendermessages",getUserMessagesToReceiver);
// // router.post("/getreceiversmessages" , getReceiversMessagesFromSender);
// router.post('/createCollaboration' , createCollaboration);
// router.post("/addCollaborators",addCollaborators)
// router.post("/getNotification" , getChatNotification)
// router.post("/getCollabDocsById" ,getCollaboratorDocs)
// router.post("updateNotification" , updateChatNotification);
// router.get("/getAllDocs",getAllDocument);
// router.post("/updateDocs",updateDocument);
// // encryptFile
// router.post("/fileconverter",singleFileConvert,fileConverter)
// router.post("/encryptFile",encryptStorage,encryptFile)
// router.post("/decryptFile",decryptFile)
// router.get("/generatePassword/:length", generatePassword);
exports.default = router;
