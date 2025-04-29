import mongoose from 'mongoose';

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const couponAppearanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
        required: true
    },
    userFullName: {
        type: String,
        required: true
    },
    couponCode: {
        type: String,
        required: true
    },
    discountApplied: {
        type: Number,
        required: true
    },
    appliedAt: {
        type: Date,
        default: () => getISTTime()
    },
    status: {
        type: String,
        enum: ['applied', 'used', 'expired'],
        default: 'applied'
    }
}, {
    timestamps: {
        currentTime: () => getISTTime()
    }
});

// Index for faster queries
couponAppearanceSchema.index({ userId: 1, couponId: 1 });
couponAppearanceSchema.index({ createdAt: 1 });
couponAppearanceSchema.index({ status: 1 });

const CouponAppearance = mongoose.model('CouponAppearance', couponAppearanceSchema);

export default CouponAppearance;