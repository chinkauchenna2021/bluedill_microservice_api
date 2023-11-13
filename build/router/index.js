"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const multer_1 = __importDefault(require("multer"));
const verifyAuth_1 = require("../middleware/verifyAuth");
const router = express_1.default.Router();
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
router.route('/').get(controllers_1.homePage);
router.get("/getTemplates", controllers_1.getAllTemplates);
router.post("/login", controllers_1.userLogin);
router.post("/useronboarding", controllers_1.userOnboarding);
router.post("/passwordrecovery", controllers_1.userRecoverPassword);
router.use(verifyAuth_1.verfyAuthToken);
router.post('/searchuserbyemail', controllers_1.searchUsersByEmail);
router.post("/uploadsingletemplates", upload, controllers_1.adminUploadTemplates);
exports.default = router;
