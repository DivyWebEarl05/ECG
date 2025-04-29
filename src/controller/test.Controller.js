import Test from "../models/testModel.js";
const BASE_URL = "https://ecg-wv62.onrender.com/uploads/test/"
// const BASE_URL = "http://localhost:5000/uploads/test/"

function combineAnswer(points) {
    const answer = [];

    if (Array.isArray(points)) {
        for (let i = 0; i < points.length; i++) {
            answer.push({
                point: points[i],
            });
        }
    } else if (typeof points === "string") {
        answer.push({
            point: points,
        });
    }
    return answer;
}
  
const testCreate = async (req, res) => {
    try {
        const {
            name,
            description_name,
            description,
            question_title,
            point,
        } = req.body;

        const answer = combineAnswer(point);

        const newTest = new Test({
            name,
            description_name,
            photo: req.file?.filename,
            description,
            question_title,
            answer,
            point
        });

        const savedTest = await newTest.save();
        res.status(201).json(savedTest);
    } catch (error) {
        res.status(500).json({ message: "Test Create failed", error: error.message });
    }
};

const updateTest = async (req, res) => {
    try {
        const {
            name,
            description_name,
            description,
            question_title,
            point,
        } = req.body;

        const existingTest = await Test.findById(req.params.id);
        if (!existingTest) {
            return res.status(404).json({ message: "Test not found" });
        }

        const existingPoints = Array.isArray(existingTest.point) ? existingTest.point : [];
        const newPoints = Array.isArray(point) ? point : [point];
        const updatedPoints = [...existingPoints, ...newPoints];

        const existingAnswers = Array.isArray(existingTest.answer) ? existingTest.answer : [];
        const newAnswers = combineAnswer(newPoints);
        const updatedAnswers = [...existingAnswers, ...newAnswers];

        existingTest.name = name || existingTest.name;
        existingTest.description_name = description_name || existingTest.description_name;
        existingTest.description = description || existingTest.description;
        existingTest.question_title = question_title || existingTest.question_title;
        existingTest.point = updatedPoints;
        existingTest.answer = updatedAnswers;

        if (req.file?.filename) {
            existingTest.photo = req.file.filename;
        }

        const updatedTest = await existingTest.save();
        res.json(updatedTest);
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};

// const getAllTest = async (req, res) => {
//     try {
//       const page = parseInt(req.query.page) || 1; // Default page = 1
//       const limit = parseInt(req.query.limit) || 10; // Default limit = 10
//       const skip = (page - 1) * limit;
  
//       const totalTests = await Test.countDocuments();
//       const tests = await Test.find().skip(skip).limit(limit);
  
//       res.json({
//         page,
//         totalPages: Math.ceil(totalTests / limit),
//         totalTests,
//         tests
//       });
//     } catch (error) {
//       res.status(500).json({ message: "Read all failed", error: error.message });
//     }
// }
const getAllTest = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default page = 1
        const limit = parseInt(req.query.limit) || 10; // Default limit = 10
        const skip = (page - 1) * limit;

        const totalTests = await Test.countDocuments();
        let tests = await Test.find().skip(skip).limit(limit);

        // Add base URL to photos
        tests = tests.map(test => {
            const testObj = test.toObject();
            if (testObj.photo) {
                // Clean the photo URL by getting only the filename
                const filename = testObj.photo.split('\\').pop().split('/').pop();
                testObj.photo = BASE_URL + filename;
            }
            return testObj;
        });

        res.json({
            page,
            totalPages: Math.ceil(totalTests / limit),
            totalTests,
            tests
        });
    } catch (error) {
        res.status(500).json({ message: "Read all failed", error: error.message });
    }
}
// const getTestById = async (req, res) => {
//     try {
//         const test = await Test.findById(req.params.id);
        
//         test.photo = BASE_URL + test.photo

//         if (!test) 
//             return res.status(404).json({ message: "Test not found" });
//             res.json(test);
//     } catch (error) {
//         res.status(500).json({ message: "Read one failed", error: error.message });
//     }
// };
const getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);

        if (!test) {
            return res.status(404).json({ message: "Test not found" });
        }

        // Clean the photo URL
        if (test.photo) {
            // Only get the filename, even if test.photo has a path
            const filename = test.photo.split('\\').pop().split('/').pop();
            test.photo = BASE_URL + filename;
        }

        res.json(test);
    } catch (error) {
        res.status(500).json({ message: "Read one failed", error: error.message });
    }
};

const deleteTest = async (req, res) => {
  try {
    const deletedTest = await Test.findByIdAndDelete(req.params.id);
    if (!deletedTest) 
        return res.status(404).json({ message: "Test not found" });
    res.json({ message: "Test deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};

export { 
    testCreate,
    updateTest,
    getAllTest,
    getTestById,
    deleteTest
}