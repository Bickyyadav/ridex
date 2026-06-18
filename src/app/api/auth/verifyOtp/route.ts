import connectDb from "@/lib/db";
import User from "@/models/user.model";

export async function POST(req: Request) {
    try {
        await connectDb()
        const { email, otp } = await req.json()
        if (!email && !otp) {
            return Response.json(
                { message: "email and otp is required" },
                { status: 400 }
            )
        }
        let user = await User.findOne({ email })
        if (!user) {
            return Response.json(
                { message: "user not found" },
                { status: 400 }
            )
        }
        if (user.isEmailVerified) {
            return Response.json(
                { message: "email is already verified" },
                { status: 400 }
            )
        }

        // how we are checking otp is expired on the we have added current time +10 minutes  in the otp expires and if the current time is more than 10 min added time then it is expires
        if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            return Response.json(
                { message: "otp has been expired" },
                { status: 400 }
            )
        }
        if (!user.otp || user.otp != otp) {
            return Response.json(
                { message: "invalid otp" },
                { status: 400 }
            )
        }
        user.isEmailVerified = true
        user.otp = undefined
        user.otpExpiresAt = undefined

        return Response.json(
            { message: "email is verified" },
            { status: 200 }
        )

    } catch (error) {
        return Response.json(
            { message: `verify email error ${error}` },
            { status: 500 }
        )
    }

}