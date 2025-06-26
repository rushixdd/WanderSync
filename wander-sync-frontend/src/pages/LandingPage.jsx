import React, { useRef } from 'react';
import HeroSection from '../components/sections/HeroSection.jsx';
import UploadSection from '../components/sections/UploadSection.jsx';
import Footer from '../components/layouts/Footer.jsx';

// LandingPage component: Orchestrates the main sections of the landing page.
export default function LandingPage() {
    // Create a ref to scroll to the UploadSection
    const uploadSectionRef = useRef(null);

    // Function to smoothly scroll to the UploadSection
    const scrollToUploadSection = () => {
        if (uploadSectionRef.current) {
            uploadSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            {/* Hero Section: The introductory part with app name, tagline, and CTA */}
            <HeroSection scrollToRef={scrollToUploadSection} />

            {/* Upload Section: Where users interact with file uploads and analysis */}
            {/* The ref is passed here to allow scrolling to this section */}
            <UploadSection ref={uploadSectionRef} />

            {/* Footer: Contains links and copyright information */}
            <Footer />
        </>
    );
}