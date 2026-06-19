"use client"
import React, { useRef } from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useParams } from 'next/navigation';

const page = () => {
    const { userData } = useSelector((state: RootState) => state.user)
    const containerRef = useRef<HTMLDivElement>(null)
    // const { roomId } = useParams()
    const displayName = userData?.role == "admin" ? "Admin" : `${userData?.name} (${userData?.email})`
    const startCall = async () => {
        if (!containerRef) {
            return null
        }
        try {
            const appID = Number(process.env.NEXT_PUBLIC_ZEGO_APP_ID)
            const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET
            const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID, serverSecret!, "hihfasdfa", "123456789", displayName
            )
            const zp = ZegoUIKitPrebuilt.create(kitToken);
            zp.joinRoom({
                container: containerRef.current,
                scenario: {
                    mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
                },
                showPreJoinView: false
            });


        } catch (error) {

        }
    }
    return (
        <div ref={containerRef}>
            <button onClick={startCall}>Click</button>
        </div>
    )
}

export default page