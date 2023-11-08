"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
router.route('/').get(controllers_1.homePage);
router.route("/login").post(controllers_1.userLogin);
router.route("/useronboarding").post(controllers_1.userOnboarding);
router.route("/passwordrecovery").post(controllers_1.userRecoverPassword);
exports.default = router;
