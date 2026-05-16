'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import AgiFloatingButton from './AgiFloatingButton';
import AgiAdvisorWindow from './AgiAdvisorWindow';

// Pure Portal renderer — AgiProvider is now in layout.tsx above this
function AgiPortalContent() {
    return (
        <>
            <AgiFloatingButton />
            <AgiAdvisorWindow />
        </>
    );
}

export default function AgiRoot() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Only render on client, after hydration
    if (!mounted) return null;

    // Portal into document.body — completely isolated from the Dashboard DOM tree
    return createPortal(<AgiPortalContent />, document.body);
}
