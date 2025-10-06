const express = require("express");
const authenticateAdmin = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/admin.middleware");
const {
    createFaculty,
    getAllFaculty,
    getFacultyById,
    editFaculty,
    deleteFaculty,
} = require("../controller/faculty.controller");

const facultyRouter = express.Router();

facultyRouter.get("/all", getAllFaculty);

facultyRouter.get("/:id", getFacultyById);

facultyRouter.post("/upload", authenticateAdmin, isAdmin, createFaculty);

facultyRouter.post("/edit/:id", authenticateAdmin, isAdmin, editFaculty);

facultyRouter.post("/delete/:id", authenticateAdmin, isAdmin, deleteFaculty);

module.exports = facultyRouter;