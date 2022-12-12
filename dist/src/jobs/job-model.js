"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const jobSchema = new mongoose_1.Schema({
    employerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Employer",
        required: [true, "A job must have an employer"],
    },
    companyName: {
        type: String,
        required: [true, "A job should have a company name"],
    },
    title: {
        type: String,
        required: [true, "Please enter the job title"],
    },
    skill: {
        type: String,
        required: [true, "Please enter the job skill"],
        enum: [
            "frontend developer",
            "backend developer",
            "UI/UX designer",
            "product designer",
            "full stack developer",
        ],
    },
    location: {
        type: String,
        required: [true, "Please enter the job location"],
        enum: ["Lagos", "Abuja", "Ogun", "Jos"],
    },
    keyword: {
        type: String,
        required: [true, "Please enter the job location"],
        enum: [
            "Nodejs",
            "TypeScript",
            "Nestjs",
            "Figma",
            "Express",
            "HTML",
            "CSS",
            "JAVASCRIPT",
            "Adobe",
            "JQUERY",
            "BOOTSTRAP",
        ],
    },
    description: {
        type: String,
        required: [true, "Please enter the job description"],
    },
    address: {
        type: String,
    },
    jobType: {
        type: String,
        required: [true, "Please enter the job type"],
        enum: ["Remote", "Physical", "Hybrid"],
    },
    workType: {
        type: String,
        required: [true, "Please enter the work type"],
        enum: ["Full Time", "Part Time"],
    },
    isAvailable: {
        type: Boolean,
        required: [true, "A job must have an availability field "],
        default: true,
    },
    salary: String,
    yearOfExperience: {
        type: String,
        required: [true, "The year(s) of experience should be stated"],
    },
}, {
    timestamps: true,
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
});
const Job = (0, mongoose_1.model)("Job", jobSchema);
exports.default = Job;
