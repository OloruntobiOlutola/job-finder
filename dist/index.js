"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get("/users", (req, res) => {
    res.status(200).json([
        {
            name: "Bola",
            dob: "17 december",
            age: 45,
            address: "Shina bola close",
        },
    ]);
});
exports.default = app;
