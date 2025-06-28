import React, { useRef } from 'react';
import HeroSection from '../components/sections/HeroSection.jsx';
import UploadSection from '../components/sections/UploadSection.jsx';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import PrivacySection from '../components/sections/PrivacySection';
import Footer from '../components/layouts/Footer.jsx';
import NavigationBar from '../components/layouts/NavigationBar';

// LandingPage component: Orchestrates the main sections of the landing page.
export default function LandingPage() {
    // Create a ref to scroll to the Section
    const uploadSectionRef = useRef(null);
    const howItWorksSectionRef = useRef(null); // New ref
    const featuresSectionRef = useRef(null);   // New ref
    const privacySectionRef = useRef(null);
    // Function to smoothly scroll to the UploadSection
    const scrollToUploadSection = () => {
        if (uploadSectionRef.current) {
            uploadSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };


    return (
        <>
            <NavigationBar/>
            <main className="flex-grow w-full">
                <HeroSection scrollToRef={scrollToUploadSection} />
                <UploadSection ref={uploadSectionRef} />
                <HowItWorksSection ref={howItWorksSectionRef} />
                <FeaturesSection ref={featuresSectionRef} />
                <PrivacySection ref={privacySectionRef} />
            </main>
            <Footer />
        </>
    );
}