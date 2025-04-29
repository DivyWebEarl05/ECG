import mongoose from "mongoose";

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const planSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    photo: {
        type: String,
        required: true
    },
    
    category :{
        type: String,   
        enum: ['Meal Plan', 'Meditation', 'Exercises']
    },

    description: {
        type: String,
        required: true
    },

    duration_in_day: {
        type: String,
        required: true
    },

    times_per_week: {
        type: String,
        required: true
    },

    difficulty: {
        type: String,
        enum: ['Beginner','Normal', 'Advanced']
    },

    title2: {
        type: String,
        required: true
    },

    description2: {
        type: String,
        required: true
    },

    schedule: [
        {
          weekNumber: {
            type: String,
            required: true
          },
          week_description: {
            type: String,
            required: true
          }
        }
    ],

    status: {
        type: String,
        enum: ['Basic', 'Pro','Premium'],
        default: 'Basic'
    },
}, 
{
    timestamps: {
        currentTime: () => getISTTime()
    }
});

const Plan = mongoose.model('Plan', planSchema);

export default Plan;