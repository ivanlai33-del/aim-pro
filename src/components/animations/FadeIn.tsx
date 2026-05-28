'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    className?: string;
    duration?: number;
    yOffset?: number;
}

export default function FadeIn({ 
    children, 
    delay = 0, 
    className = '',
    duration = 0.8,
    yOffset = 40
}: FadeInProps) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: yOffset }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
                duration, 
                delay, 
                ease: [0.21, 0.47, 0.32, 0.98] // Custom easing for premium feel
            }}
        >
            {children}
        </motion.div>
    );
}
