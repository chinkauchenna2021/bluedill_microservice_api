"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const router_1 = __importDefault(require("./router"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = config_1.PORT | 8000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use('/', router_1.default);
// app.use(bodyParser.json);
// app.use(bodyParser.urlencoded({extended:false}));
app.listen(config_1.PORT, () => {
    console.log(`app running on port ${config_1.PORT}`);
});
