import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.email || session.user.role !== "admin") {
            return Response.json({ message: "unauthorized" }
                , { status: 400 }
            )
        }

        const totalPartners = await User.countDocuments({ role: "partner" }) //find the total partner in the db 
        const totalApprovedPartners = await User.countDocuments({ role: "partner", partnerStatus: "approved" })
        const totalPendingPartners = await User.countDocuments({ role: "partner", partnerStatus: "pending" })
        const totalRejectedPartners = await User.countDocuments({ role: "partner", partnerStatus: "rejected" })
        // no of user is in review for partner and pending with third step
        const pendingPartnerUsers = await User.find({
            role: "partner",
            partnerStatus: "pending",
            partnerOnBoardingSteps: { $gte: 3 }
        })
        console.log(pendingPartnerUsers)
        // extracting id from the user 
        const partnerIds = pendingPartnerUsers.map((p) => p._id)
        // with the help of partnerIds we will finding vehicles  
        // Find all vehicles whose owner is present inside partnerIds
        const partnerVehicles = await Vehicle.find({ owner: { $in: partnerIds } })
        //now finding vehicles with their types in array
        //    partnerVehicles.map((v) => [String(v.owner), v.type]) with this 
        //         [
        //   ["101", "Car"],
        //   ["102", "Bike"]
        // ]
        // new Map(...)
        //         Map {
        //   "101" => "Car",
        //   "102" => "Bike"
        // }
        // Now you can quickly get vehicle type using owner id:
        //vehicleTypeMap.get("101") // Car
        // vehicleTypeMap.get("102") // Bike
        const vehicleTypeMap = new Map(
            partnerVehicles.map((v) => [String(v.owner), v.type])
        )

        const pendingPartnersReviews = pendingPartnerUsers.map((p) => ({
            _id: p._id,
            name: p.name,
            email: p.email,
            vehicleType: vehicleTypeMap.get(String(p._id))
        }))
        const pendingVehicles = await Vehicle.find({
            status: "pending",
            baseFare: { $exists: true },
            pricePerKM: { $exists: true }
        }).populate("owner")

        return NextResponse.json({
            pendingVehicles,
            stats: {
                totalPartners,
                totalApprovedPartners,
                totalPendingPartners,
                totalRejectedPartners
            }, pendingPartnersReviews
        }, { status: 200 })

    } catch (error) {
        return NextResponse.json({
            message: `admin dashboard error ${error}`
        }, {
            status: 500
        })

    }


}