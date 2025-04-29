import Plan from "../models/planModel.js";
const BASE_URL = "https://ecg-wv62.onrender.com/uploads/plans/"
// const BASE_URL = "http://localhost:5000/uploads/plans/"

// function combineSchedule(weekNumbers, weekDescriptions) {
//   const schedule = [];

//   if (Array.isArray(weekNumbers) && Array.isArray(weekDescriptions)) {
//     for (let i = 0; i < weekNumbers.length; i++) {
//       schedule.push({
//         weekNumber: weekNumbers[i],
//         week_description: weekDescriptions[i],
//       });
//     }
//   } else if (
//     typeof weekNumbers === "string" &&
//     typeof weekDescriptions === "string"
//   ) {
//     schedule.push({
//       weekNumber: weekNumbers,
//       week_description: weekDescriptions,
//     });
//   }
//   return schedule;
// }

const createPlan = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      duration_in_day,
      times_per_week,
      difficulty,
      title2,
      description2,
      schedule
    } = req.body;

    // const schedule = combineSchedule(weekNumber, week_description);

    const newPlan = new Plan({
      title,
      photo: req.file?.filename,
      category,
      description,
      duration_in_day,
      times_per_week,
      difficulty,
      title2,
      description2,
      schedule,
    });

    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);
  } catch (error) {
    res.status(500).json({ message: "Create failed", error: error.message });
  }
};

// const updatePlan = async (req, res) => {
//   try {
//     const {
//       title,
//       category,
//       description,
//       duration_in_day,
//       times_per_week,
//       difficulty,
//       title2,
//       description2,
//       weekNumber,
//       week_description,
//     } = req.body;

//     const existingPlan = await Plan.findById(req.params.id);
//     if (!existingPlan)
//       return res.status(404).json({ message: "Plan not found" });

//     const newSchedule = [];
//     if (weekNumber && week_description) {
//       if (Array.isArray(weekNumber) && Array.isArray(week_description)) {
//         for (let i = 0; i < weekNumber.length; i++) {
//           newSchedule.push({
//             weekNumber: weekNumber[i],
//             week_description: week_description[i],
//           });
//         }
//       } else {
//         newSchedule.push({
//           weekNumber,
//           week_description,
//         });
//       }
//     }

//     const updatedSchedule = [...existingPlan.schedule, ...newSchedule];

//     existingPlan.title = title || existingPlan.title;
//     existingPlan.category = category || existingPlan.category;
//     existingPlan.description = description || existingPlan.description;
//     existingPlan.duration_in_day =
//       duration_in_day || existingPlan.duration_in_day;
//     existingPlan.times_per_week = times_per_week || existingPlan.times_per_week;
//     existingPlan.difficulty = difficulty || existingPlan.difficulty;
//     existingPlan.title2 = title2 || existingPlan.title2;
//     existingPlan.description2 = description2 || existingPlan.description2;
//     existingPlan.schedule = updatedSchedule;

//     if (req.file?.filename) {
//       existingPlan.photo = req.file.filename;
//     }

//     const updatedPlan = await existingPlan.save();
//     res.json(updatedPlan);
//   } catch (error) {
//     res.status(500).json({ message: "Update failed", error: error.message });
//   }
// };

const updatePlan = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      duration_in_day,
      times_per_week,
      difficulty,
      title2,
      description2,
      // weekNumber,
      // week_description,
      // weekIndex,
      schedule,
      // status
    } = req.body;

    const existingPlan = await Plan.findById(req.params.id);
    if (!existingPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      });
    }

    // let updatedSchedule = [...existingPlan.schedule];

    // if (
    //   typeof weekIndex !== 'undefined' &&
    //   weekNumber &&
    //   week_description
    // ) {
    //   const index = parseInt(weekIndex);
    //   if (index < 0 || index >= updatedSchedule.length) {
    //     return res.status(400).json({
    //       success: false,
    //       message: "Invalid week index"
    //     });
    //   }

    //   updatedSchedule[index] = {
    //     weekNumber,
    //     week_description
    //   };
    // }

    // else if (
    //   !Array.isArray(weekNumber) &&
    //   !Array.isArray(week_description) &&
    //   weekNumber &&
    //   week_description
    // ) {
    //   if (updatedSchedule.length > 0) {
    //     updatedSchedule[0] = { weekNumber, week_description };
    //   } else {
    //     updatedSchedule.push({ weekNumber, week_description });
    //   }
    // }

    // else if (
    //   Array.isArray(weekNumber) &&
    //   Array.isArray(week_description)
    // ) {
    //   for (let i = 0; i < weekNumber.length; i++) {
    //     updatedSchedule.push({
    //       weekNumber: weekNumber[i],
    //       week_description: week_description[i]
    //     });
    //   }
    // }

    // ✅ Prepare updated fields
    const updates = {
      title: title || existingPlan.title,
      category: category || existingPlan.category,
      description: description || existingPlan.description,
      duration_in_day: duration_in_day || existingPlan.duration_in_day,
      times_per_week: times_per_week || existingPlan.times_per_week,
      difficulty: difficulty || existingPlan.difficulty,
      title2: title2 || existingPlan.title2,
      description2: description2 || existingPlan.description2,
      // status: status || existingPlan.status,
      schedule: schedule || existingPlan.schedule
    };

    if (req.file?.filename) {
      updates.photo = req.file.filename;
    }

    const updatedPlan = await Plan.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      plan: updatedPlan
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message
    });
  }
};


const getAllPlans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default page = 1
    const limit = 50; // Fixed limit of 50 per page
    const skip = (page - 1) * limit;

    const totalPlans = await Plan.countDocuments();
    let plans = await Plan.find().skip(skip).limit(limit);

    // Add base URL to photos
    plans = plans.map(plan => {
      const planObj = plan.toObject();
      if (planObj.photo) {
        planObj.photo = BASE_URL + planObj.photo;
      }
      return planObj;
    });

    res.json({
      message: "Plans fetched successfully",
      page,
      totalPages: Math.ceil(totalPlans / limit),
      totalPlans,
      resultsOnPage: plans.length,
      plans,
    });
  } catch (error) {
    res.status(500).json({ message: "Read all failed", error: error.message });
  }
};


const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    plan.photo = BASE_URL + plan.photo

    if (!plan) return res.status(404).json({ message: "Plan not found" });

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: "Read one failed", error: error.message });
  }
};

const deletePlan = async (req, res) => {
  try {
    const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
    if (!deletedPlan)
      return res.status(404).json({ message: "Plan not found" });
    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};

const planStatusUpdate = async (req, res) => {
  try {
      const { status } = req.body;

      if (!['Basic', 'Pro', 'Premium'].includes(status)) {
          return res.status(400).json({
              success: false,
              message: "Invalid status value. Must be either 'Basic', 'Pro' or 'Premium'"
          });
      }

      const plan = await Plan.findByIdAndUpdate(
          req.params.id,
          { status },
          { new: true }
      );

      if (!plan) {
          return res.status(404).json({
              success: false,
              message: "Plan not found"
          });
      }

      res.status(200).json({
          success: true,
          message: `Plan status updated to ${status} successfully`,
          plan
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: "Failed to update plan status",
          error: error.message
      });
  }
};

export { createPlan, getAllPlans, updatePlan, getPlanById, deletePlan, planStatusUpdate };