"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUsers = exports.getUser = void 0;
const generic_controllers_1 = require("../../utils/generic-controllers");
const users_model_1 = __importDefault(require("./users-model"));
exports.getUser = (0, generic_controllers_1.getOne)(users_model_1.default);
exports.getUsers = (0, generic_controllers_1.getAll)(users_model_1.default);
exports.deleteUser = (0, generic_controllers_1.deleteOne)(users_model_1.default);
