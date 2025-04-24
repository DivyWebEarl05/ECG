import mongoose from "mongoose";

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    
    email : {
        type: String,
        required: true,
        unique: true,
    },

    phoneNumber : {
        type: String,
        required: true,
        unique: true,
    },

    password : {
        type: String,
        required: true,
    },

    age: {
        type: Number,
    },

    gender :{
        type: String,   
        enum: ['Male', 'Female', 'Other']
    },

    weight: {
        type: Number,
    },

    height: {
        type: Number,
    },
}, 
{
    timestamps: {
        currentTime: () => getISTTime()
    }
});

const User = mongoose.model('User', userSchema);

export default User;