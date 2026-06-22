import SearchPage from '@/components/SearchPage'
import React, { Suspense } from 'react'

const page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchPage />
        </Suspense>
    )
}

export default page