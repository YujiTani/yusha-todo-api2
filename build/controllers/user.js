"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../config/logging"));
const NAMESPACE = 'User Controller';
const getUsers = (req, res, next) => {
    logging_1.default.info(NAMESPACE, `user get route called.`);
    return res.status(200).json({
        message: 'pong'
    });
};
exports.default = { getUsers };
