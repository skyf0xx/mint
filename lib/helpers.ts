export const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
        // Add offset to account for sticky header
        const offset = 80; // Adjust this value based on your navbar height
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
        });
    }
};

export const referalLink = (referralCode: string) => {
    return `${window.location.origin}/referral/index.html?ref=${referralCode}`;
};

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export const useAnimationPreferences = () => {
    const prefersReducedMotion = useReducedMotion();
    const [isEnabled, setIsEnabled] = useState(true);

    // Check for localStorage preference
    useEffect(() => {
        const savedPreference = localStorage.getItem('userAnimationPreference');
        if (savedPreference !== null) {
            setIsEnabled(savedPreference === 'true');
        } else {
            // If no saved preference, respect system setting
            setIsEnabled(!prefersReducedMotion);
        }
    }, [prefersReducedMotion]);

    // Function to toggle animation preference
    const toggleAnimations = () => {
        const newValue = !isEnabled;
        setIsEnabled(newValue);
        localStorage.setItem('userAnimationPreference', newValue.toString());
    };

    return {
        isAnimationEnabled: isEnabled && !prefersReducedMotion,
        toggleAnimations,
    };
};

// Helper to simplify animation implementation
export const getConditionalAnimations = (isEnabled: boolean) => {
    return {
        // Helper for entrance animations
        entrance: (delay = 0) => ({
            initial: isEnabled ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.5, delay },
        }),

        // Helper for hover effects
        hover: {
            whileHover: isEnabled ? { scale: 1.05 } : {},
            whileTap: isEnabled ? { scale: 0.95 } : {},
        },

        // Helper for staggered children
        stagger: (delayChildren = 0.1, staggerChildren = 0.1) => ({
            initial: { opacity: 0 },
            animate: {
                opacity: 1,
                transition: {
                    delayChildren,
                    staggerChildren,
                },
            },
        }),

        // Helper for content reveal
        reveal: {
            initial: isEnabled ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: '-50px' },
            transition: { duration: 0.5 },
        },
    };
};
