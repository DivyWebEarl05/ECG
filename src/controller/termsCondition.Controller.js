import TermsCondition from "../models/termsconditionModel.js";

const createTermsCondition = async (req, res) => {
  try {
    const { title, description } = req.body;
    const termscondition = new TermsCondition({
      title,
      description,
    });

    await termscondition.save();
    res.status(201).json({
      message: "Terms & Condition craeted successfully",
      termscondition,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error craeting Terms & Condition",
      error: error.message,
    });
  }
};

const getAllTermsCondition = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // Changed to 50 docs per page
    const skip = (page - 1) * limit;

    const totalTerms = await TermsCondition.countDocuments();
    const totalPages = Math.ceil(totalTerms / limit);

    // Validate page number
    if (page > totalPages && totalTerms > 0) {
      return res.status(400).json({
        success: false,
        message: `Page ${page} does not exist. Total pages available: ${totalPages}`,
      });
    }

    const termsConditions = await TermsCondition.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance

    res.status(200).json({
      success: true,
      message: "Terms & Conditions fetched successfully",
      pagination: {
        currentPage: page,
        totalPages,
        totalTerms,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
        showing: termsConditions.length,
      },
      termsConditions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Terms & Conditions",
      error: error.message,
    });
  }
};

const getTermsConditionById = async (req, res) => {
  try {
    const { id } = req.params;
    const gettermsconditionById = await TermsCondition.findById(id);
    if (!gettermsconditionById) {
      return res.status(404).json({
        message: "Terms & Condition not found",
      });
    }
    res.status(200).json({
      message: "Terms & Condition fetched successsfully",
      gettermsconditionById,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Terms & Condition",
      error: error.message,
    });
  }
};

const updateTermsCondition = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const updatetermscondition = await TermsCondition.findByIdAndUpdate(
      id,
      {
        title,
        description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatetermscondition) {
      return res.status(404).json({ message: "Terms & Condition not found" });
    }

    res.status(200).json({
      message: "Terms & Condition updated successfully",
      updatetermscondition,
    });
  } catch (error) {
    console.error("Error updating Terms & Condition:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteTermsCondition = async (req, res) => {
  try {
    const deletetermscondition = await TermsCondition.findByIdAndDelete(
      req.params.id
    );
    if (!deletetermscondition)
      return res.status(404).json({ message: "Terms & Condition not found" });
    res.json({ message: "Terms & Condition deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};

export {
  createTermsCondition,
  getAllTermsCondition,
  getTermsConditionById,
  updateTermsCondition,
  deleteTermsCondition,
};
