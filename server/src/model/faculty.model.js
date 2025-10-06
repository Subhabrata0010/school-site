const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        imageUrl: {
            type: String,
            required: true,
            trim: true,
        },
        mail: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        qualification: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = { Faculty: mongoose.model("Faculty", facultySchema) };