"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const { DB_URL, PORT } = process.env;
const port = PORT || 3000;
mongoose_1.default
    .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("connected to Db"))
    .catch((err) => console.log(err));
index_1.default.listen(port, () => console.log(`Server is running at ${port}`));
