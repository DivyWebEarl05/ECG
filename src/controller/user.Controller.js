import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d', 
    });
};

const SignUp = async (req, res) => {
    const { full_name, email, phoneNumber, password } = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
    }
 
    try {
        const userExists = await User.findOne({ $or: [{ email }, { phoneNumber }] });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email/phone number' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            full_name,
            email,
            phoneNumber,
            password: hashedPassword,
        });

        res.status(201).json({
            _id: user._id,
            full_name: user.full_name,
            email: user.email,
            phoneNumber: user.phoneNumber,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

const SignIn = async (req, res) => {
    const { email, phoneNumber, password } = req.body;

    try {
        const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email/phone number or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email/phone number or password' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            _id: user._id,
            full_name: user.full_name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); 

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            _id: user._id,
            full_name: user.full_name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            age: user.age,
            gender: user.gender,
            weight: user.weight,
            height: user.height,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
};

const updateUserProfile = async (req, res) => {
    const { full_name, email, phoneNumber, age, gender, weight, height } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.full_name = full_name || user.full_name;
        user.email = email || user.email;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.age = age || user.age;
        user.gender = gender || user.gender;
        user.weight = weight || user.weight;
        user.height = height || user.height;

        await user.save();

        res.status(200).json({
            _id: user._id,
            full_name: user.full_name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            age: user.age,
            gender: user.gender,
            weight: user.weight,
            height: user.height,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Find user by ID
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Compare old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Save user with new password
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// const forgetPassword = async (req, res) => {
//     try {
//         const { email, phoneNumber, newPassword } = req.body;

//         if (!email && !phoneNumber) {
//             return res.status(400).json({ success: false, message: 'Email or PhoneNumber is required' });
//         }

//         const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'No user found with this email or PhoneNumber' });
//         }

//         const hashedPassword = await bcrypt.hash(newPassword, 10);
//         user.password = hashedPassword;
//         await user.save();

//         return res.status(200).json({ success: true, message: 'Password changed successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// const deleteUserProfile = async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.user._id);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.status(200).json({ message: 'User deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting user' });
//     }
// };

export {
    SignUp,
    SignIn,
    getUserProfile,
    updateUserProfile,
    changePassword,
    // forgetPassword
    // deleteUserProfile
}