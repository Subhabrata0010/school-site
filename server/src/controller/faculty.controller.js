const { Faculty } = require("../model/faculty.model");

const createFaculty = async (req, res) => {
    try {
        const { name, imageUrl, mail, qualification } = req.body;

        if (
            [name, imageUrl, mail, qualification].some(
                (field) => typeof field !== "string" || field.trim() === ""
            )
        ) {
            return res
                .status(400)
                .json({ success: false, message: "insufficient data" });
        }

        const existingFaculty = await Faculty.findOne({ mail });
        if (existingFaculty) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "faculty with this email already exists",
                });
        }

        await Faculty.create({
            name,
            imageUrl,
            mail,
            qualification
        });

        return res
            .status(200)
            .json({ success: true, message: "faculty created successfully" });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ success: false, message: "something went wrong", error: error.message });
    }
};

const getAllFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.find({}).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "faculty fetched",
            faculty,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "something went wrong" });
    }
};

const getFacultyById = async (req, res) => {
    try {
        const { id } = req.params;
        const faculty = await Faculty.findById(id);

        if (!faculty) {
            return res
                .status(404)
                .json({ success: false, message: "faculty not found" });
        }

        return res
            .status(200)
            .json({ success: true, message: "faculty fetched", faculty });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "something went wrong" });
    }
};

const editFaculty = async (req, res) => {
    try {
        const { name, imageUrl, mail, qualification } = req.body;
        const { id } = req.params;

        const isFacultyExist = await Faculty.findById(id);

        if (!isFacultyExist) {
            return res
                .status(404)
                .json({ success: false, message: "faculty doesn't exist" });
        }

        await Faculty.updateOne(
            { _id: id },
            {
                name,
                imageUrl,
                mail,
                qualification,
            }
        );

        return res
            .status(200)
            .json({ success: true, message: "faculty updated" });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "something went wrong",error: error.message});
    }
};

const deleteFaculty = async (req, res) => {
    try {
        const { id } = req.params;

        const isFacultyExist = await Faculty.findById(id);

        if (!isFacultyExist) {
            return res
                .status(404)
                .json({ success: false, message: "faculty doesn't exist" });
        }

        await Faculty.deleteOne({ _id: id });

        return res
            .status(200)
            .json({ success: true, message: "faculty deleted" });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "something went wrong" });
    }
};

module.exports = {
    createFaculty,
    getAllFaculty,
    getFacultyById,
    editFaculty,
    deleteFaculty,
};