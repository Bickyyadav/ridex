"use client"

import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'
// this folder we have created because we are not able to write sessionPRovider in layout folder because SessionProvider is client componen and layout.tsx is server component so we make seperate folder and import it

const Provider = ({ children }: { children: ReactNode }) => {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}

export default Provider