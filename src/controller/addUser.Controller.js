import AddedUser from '../models/userAddModel.js';

const addMember = async (req, res) => {
    const { full_name, relation, age, gender, weight, height } = req.body;
    
    try {
        const user = await AddedUser.create({
            full_name,
            relation,
            age,
            gender,
            weight,
            height,
            createdBy: req.user.id 
        });

        res.status(201).json({
            _id: user._id,
            full_name: user.full_name,
            relation: user.relation,
            age: user.age,
            weight: user.weight,
            height: user.height
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering while adding user' });
    }
};

const updateFamilyMember = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedMember = await AddedUser.findOneAndUpdate(
            { _id: id, createdBy: req.user.id },
            updates,
            { new: true }
        );

        if (!updatedMember) {
            return res.status(404).json({ message: "Family member not found or unauthorized" });
        }

        res.status(200).json({ message: "Family member updated successfully", data: updatedMember });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const deleteFamilyMember = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedMember = await AddedUser.findOneAndDelete({ _id: id, createdBy: req.user.id });

        if (!deletedMember) {
            return res.status(404).json({ message: "Family member not found or unauthorized" });
        }

        res.status(200).json({ message: "Family member deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getFamilyMemberById = async (req, res) => {
    try {
        const { id } = req.params;

        const familyMember = await AddedUser.findOne({ _id: id, createdBy: req.user.id });

        if (!familyMember) {
            return res.status(404).json({ message: "Family member not found or unauthorized" });
        }

        res.status(200).json({ message: "Family member fetched successfully", data: familyMember });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getAllFamilyMembers = async (req, res) => {
    try {
        const familyMembers = await AddedUser.find({ createdBy: req.user.id });

        res.status(200).json({ message: "Family members fetched successfully", data: familyMembers });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export {
    addMember,
    updateFamilyMember,
    deleteFamilyMember,
    getAllFamilyMembers,
    getFamilyMemberById
};
