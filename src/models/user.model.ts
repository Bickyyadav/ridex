import mongoose, { Document } from "mongoose";


type VideoKycStatus =
    "not_required"
    | "pending"
    | "in_progress"
    | "approved"
    | "rejected";

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
    rejectionReason?: string
    videoKycStatus: VideoKycStatus
    videoKycRoomId: string
    videoKycRejectionReason: string
    socketId: string | null
    location?: {
        type: "Point",
        coordinates: [number, number]
    }
    isOnline: boolean
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

    rejectionReason: {
        type: String
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
    otp: {
        type: String,

    },
    otpExpiresAt: {
        type: Date,
    },
    videoKycStatus: {
        type: String,
        enum: ["not_required", "pending", "in_progress", "approved", "rejected"],
        default: "not_required"
    },
    videoKycRoomId: {
        type: String
    },
    videoKycRejectionReason: {
        type: String
    },
    socketId: {
        type: String,
        default: null
    },
    isOnline: {
        type: Boolean,
        default: false,
        index: true
    },
    location: {
        type: {
            type: String,
            enum: ["Point"]
        },
        coordinates: [Number]
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "partner", "admin"]

    },
    partnerStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, { timestamps: true })

// to prevent from edge server we prevent this
userSchema.index({ location: "2dsphere" })

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User
