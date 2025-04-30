import PrivacyPolicy from "../models/privacypolicyModel.js";

const createPrivacyPolicy = async (req, res) => {
  try {
    const { title, description } = req.body;
    const privacypolicy = new PrivacyPolicy({
      title,
      description,
    });

    await privacypolicy.save();
    res.status(201).json({
      message: "PrivacyPolicy craeted successfully",
      privacypolicy,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error craeting PrivacyPolicy",
      error: error.message,
    });
  }
};

const getAllPrivacyPolicy = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // Changed to 50 docs per page
    const skip = (page - 1) * limit;

    const totalPrivacyPolicies = await PrivacyPolicy.countDocuments();
    const totalPages = Math.ceil(totalPrivacyPolicies / limit);

    // Validate page number
    if (page > totalPages && totalPrivacyPolicies > 0) {
      return res.status(400).json({
        success: false,
        message: `Page ${page} does not exist. Total pages available: ${totalPages}`,
      });
    }

    const privacyPolicies = await PrivacyPolicy.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance

    res.status(200).json({
      success: true,
      message: "Privacy Policies fetched successfully",
      pagination: {
        currentPage: page,
        totalPages,
        totalPrivacyPolicies,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
        showing: privacyPolicies.length,
      },
      privacyPolicies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Privacy Policies",
      error: error.message,
    });
  }
};

const getPrivacyPolicyById = async (req, res) => {
  try {
    const { id } = req.params;
    const getprivacypolicyById = await PrivacyPolicy.findById(id);
    if (!getprivacypolicyById) {
      return res.status(404).json({
        message: "PrivacyPolicy not found",
      });
    }
    res.status(200).json({
      message: "PrivacyPolicy fetched successsfully",
      getprivacypolicyById,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching PrivacyPolicy",
      error: error.message,
    });
  }
};

const updatePrivacyPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const updateprivacypolicy = await PrivacyPolicy.findByIdAndUpdate(
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

    if (!updateprivacypolicy) {
      return res.status(404).json({ message: "PrivacyPolicy not found" });
    }

    res.status(200).json({
      message: "PrivacyPolicy updated successfully",
      updateprivacypolicy,
    });
  } catch (error) {
    console.error("Error updating PrivacyPolicy:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deletePrivacyPolicy = async (req, res) => {
  try {
    const deleteprivacypolicy = await PrivacyPolicy.findByIdAndDelete(
      req.params.id
    );
    if (!deleteprivacypolicy)
      return res.status(404).json({ message: "PrivacyPolicy not found" });
    res.json({ message: "PrivacyPolicy deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};

export {
  createPrivacyPolicy,
  getAllPrivacyPolicy,
  getPrivacyPolicyById,
  updatePrivacyPolicy,
  deletePrivacyPolicy,
};
