import CheckOutContent from '@/components/CheckOutContent'
import React, { Suspense } from 'react'

const page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CheckOutContent />
        </Suspense>
    )
}

export default page