import PrivacyPolicy from "../models/privacypolicyModel.js";

const createPrivacyPolicy = async (req, res) => {
    try {
        const { title, description} = req.body;
        const privacypolicy = new PrivacyPolicy({
            title,
            description,
        })

        await privacypolicy.save();
        res.status(201).json({
            message : "PrivacyPolicy craeted successfully",
            privacypolicy
        })

    } catch (error) {
        res.status(500).json({
            message: "Error craeting PrivacyPolicy",
            error: error.message,
        })
    } 
}

const getAllPrivacyPolicy = async (req, res) => {
    try {
        const getprivacypolicy =  await PrivacyPolicy.find({}).sort({ createdAt: -1 });
        res.status(200).json({
            message: "PrivacyPolicy fetched successfully",
            getprivacypolicy
        })        
    } catch (error) {
        res.status(500).json({
            message: "Error fetching PrivacyPolicy",
            error: error.messsage,
        })
    }
}

const getPrivacyPolicyById = async (req, res) => {
    try {
        const { id } = req.params;
        const getprivacypolicyById = await PrivacyPolicy.findById(id);
        if (!getprivacypolicyById){
            return res.status(404).json({
                message: "PrivacyPolicy not found"
            })
        }
        res.status(200).json({
            message : "PrivacyPolicy fetched successsfully",
            getprivacypolicyById
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching PrivacyPolicy",
            error: error.message,
        })
    }
}

const updatePrivacyPolicy = async (req, res) => {
    try {
        const { id } = req.params; 
        const {  title, description } = req.body; 
        
        const updateprivacypolicy = await PrivacyPolicy.findByIdAndUpdate(
            id, 
            {
                title,
                description
            },
            { 
                new: true, 
                runValidators: true 
            });

        if (!updateprivacypolicy) {
            return res.status(404).json({ message: 'PrivacyPolicy not found' });
        }

        res.status(200).json({
            message: 'PrivacyPolicy updated successfully',
            updateprivacypolicy
        });
    } catch (error) {
        console.error('Error updating PrivacyPolicy:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deletePrivacyPolicy = async (req, res) => {
    try {
      const deleteprivacypolicy = await PrivacyPolicy.findByIdAndDelete(req.params.id);
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
    deletePrivacyPolicy
}