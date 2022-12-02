"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const profileSchema = new mongoose_1.Schema({
    cv: String,
    skill: {
        type: [String],
        enum: [
            "frontend developer",
            "backend developer",
            "UI/UX designer",
            "product designer",
            "full stack developer",
            "technical writer",
        ],
        required: [true, "An employee should provide skill(s)"],
    },
    yearsOfExperience: {
        type: Number,
        required: [true, "An employee should provide years of experience"],
    },
    address: String,
    linkedlnUrl: String,
    githubUrl: String,
}, {
    timestamps: true,
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
});
const Profile = (0, mongoose_1.model)("Profile", profileSchema);
exports.default = Profile;
