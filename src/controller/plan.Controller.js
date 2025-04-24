import Plan from "../models/planModel.js";

function combineSchedule(weekNumbers, weekDescriptions) {
  const schedule = [];

  if (Array.isArray(weekNumbers) && Array.isArray(weekDescriptions)) {
    for (let i = 0; i < weekNumbers.length; i++) {
      schedule.push({
        weekNumber: weekNumbers[i],
        week_description: weekDescriptions[i],
      });
    }
  } else if (typeof weekNumbers === "string" && typeof weekDescriptions === "string") {
    schedule.push({
      weekNumber: weekNumbers,
      week_description: weekDescriptions,
    });
  }
  return schedule;
}

const createPlan = async (req, res) => {
  try {
    const {
      title,
      categoty,
      description,
      duration_in_day,
      times_per_week,
      difficulty,
      title2,
      description2,
      weekNumber,
      week_description,
    } = req.body;

    const schedule = combineSchedule(weekNumber, week_description);

    const newPlan = new Plan({
      title,
      photo: req.file?.path,
      categoty,
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

const updatePlan = async (req, res) => {
  try {
    const {
      title,
      categoty,
      description,
      duration_in_day,
      times_per_week,
      difficulty,
      title2,
      description2,
      weekNumber,
      week_description
    } = req.body;

    const existingPlan = await Plan.findById(req.params.id);
    if (!existingPlan) return res.status(404).json({ message: 'Plan not found' });

    const newSchedule = [];
    if (weekNumber && week_description) {
      if (Array.isArray(weekNumber) && Array.isArray(week_description)) {
        for (let i = 0; i < weekNumber.length; i++) {
          newSchedule.push({
            weekNumber: weekNumber[i],
            week_description: week_description[i],
          });
        }
      } else {
        newSchedule.push({
          weekNumber,
          week_description,
        });
      }
    }

    const updatedSchedule = [...existingPlan.schedule, ...newSchedule];

    existingPlan.title = title || existingPlan.title;
    existingPlan.categoty = categoty || existingPlan.categoty;
    existingPlan.description = description || existingPlan.description;
    existingPlan.duration_in_day = duration_in_day || existingPlan.duration_in_day;
    existingPlan.times_per_week = times_per_week || existingPlan.times_per_week;
    existingPlan.difficulty = difficulty || existingPlan.difficulty;
    existingPlan.title2 = title2 || existingPlan.title2;
    existingPlan.description2 = description2 || existingPlan.description2;
    existingPlan.schedule = updatedSchedule;

    if (req.file?.path) {
      existingPlan.photo = req.file.path;
    }

    const updatedPlan = await existingPlan.save();
    res.json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Read all failed", error: error.message });
  }
};

const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) 
      return res.status(404).json({ message: "Plan not found" });
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

export { 
    createPlan, 
    getAllPlans, 
    updatePlan, 
    getPlanById, 
    deletePlan 
};