import TermsCondition from "../models/termsconditionModel.js";

const createTermsCondition = async (req, res) => {
    try {
        const { title, description} = req.body;
        const termscondition = new TermsCondition({
            title,
            description,
        })

        await termscondition.save();
        res.status(201).json({
            message : "Terms & Condition craeted successfully",
            termscondition
        })

    } catch (error) {
        res.status(500).json({
            message: "Error craeting Terms & Condition",
            error: error.message,
        })
    }
}

const getAllTermsCondition = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // default page = 1
      const limit = parseInt(req.query.limit) || 10; // default limit = 10
      const skip = (page - 1) * limit;
  
      const totalTerms = await TermsCondition.countDocuments();
      const gettermscondition = await TermsCondition.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
  
      res.status(200).json({
        message: "Terms & Condition fetched successfully",
        page,
        totalPages: Math.ceil(totalTerms / limit),
        totalTerms,
        gettermscondition,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching Terms & Condition",
        error: error.message,
      });
    }
}
  

const getTermsConditionById = async (req, res) => {
    try {
        const { id } = req.params;
        const gettermsconditionById = await TermsCondition.findById(id);
        if (!gettermsconditionById){
            return res.status(404).json({
                message: "Terms & Condition not found"
            })
        }
        res.status(200).json({
            message : "Terms & Condition fetched successsfully",
            gettermsconditionById
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching Terms & Condition",
            error: error.message,
        })
    }
}

const updateTermsCondition = async (req, res) => {
    try {
        const { id } = req.params; 
        const {  title, description } = req.body; 
        
        const updatetermscondition = await TermsCondition.findByIdAndUpdate(
            id, 
            {
                title,
                description
            },
            { 
                new: true, 
                runValidators: true 
            });

        if (!updatetermscondition) {
            return res.status(404).json({ message: 'Terms & Condition not found' });
        }

        res.status(200).json({
            message: 'Terms & Condition updated successfully',
            updatetermscondition
        });
    } catch (error) {
        console.error('Error updating Terms & Condition:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteTermsCondition = async (req, res) => {
    try {
      const deletetermscondition = await TermsCondition.findByIdAndDelete(req.params.id);
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
    deleteTermsCondition
}