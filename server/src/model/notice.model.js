const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        details: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = { Notice: mongoose.model("Notice", noticeSchema) };
