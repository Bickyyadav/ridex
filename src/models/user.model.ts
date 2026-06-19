import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "user" | "partner" | "admin";
    partnerStatus: "pending" | "approved" | "rejected";
    isEmailVerified?: boolean;
    otp?: string;
    otpExpiresAt?: Date;
    mobileNumber?: string
    partnerOnBoardingSteps: number
    createdAt: Date;
    updatedAt: Date
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,

    },
    partnerOnBoardingSteps: {
        type: Number,
        min: 0,
        max: 8,
        default: 0,
    },
    mobileNumber: {
        type: String
    },
    otpExpiresAt: {
        type: Date,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "partner", "admin"]

    }

}, { timestamps: true })

// to prevent from edge server we prevent this
userSchema.index({ location: "2dsphere" })

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User
