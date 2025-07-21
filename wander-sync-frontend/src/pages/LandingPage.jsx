// src/pages/LandingPage.jsx
import React, { useRef, useReducer, useCallback } from 'react';
import HeroSection from '../components/sections/HeroSection.jsx';
import UploadSection from '../components/sections/UploadSection.jsx';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import PrivacySection from '../components/sections/PrivacySection';
import ProximityResultsSection from '../components/sections/ProximityResultsSection';
import Footer from '../components/layouts/Footer.jsx';
import NavigationBar from '../components/layouts/NavigationBar';
import { onAnalyze } from '../services/proximityService';

// LandingPage component: Orchestrates the main sections of the landing page.
export default function LandingPage() {
    // Refs for scrolling to specific sections
    const sectionRefs = {
        upload: useRef(null),
        results: useRef(null)
    };

    // Reducer for managing analysis state
    const initialState = {
        analysisResults: null,
        loading: false,
        error: null
    };

    const analysisReducer = (state, action) => {
        switch (action.type) {
            case 'START_ANALYSIS':
                return {
                    ...state,
                    loading: true,
                    error: null,
                    analysisResults: null
                };
            case 'ANALYSIS_SUCCESS':
                return {
                    ...state,
                    loading: false,
                    analysisResults: action.payload,
                };
            case 'ANALYSIS_ERROR':
                return {
                    ...state,
                    loading: false,
                    error: action.payload
                };
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(analysisReducer, initialState);
    const { analysisResults, loading, error } = state;

    // Function to smoothly scroll to a section
    const scrollToSection = useCallback((ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    // Function passed to UploadSection to trigger analysis
    const handleAnalyze = useCallback(async (formData) => {
        dispatch({ type: 'START_ANALYSIS' });

        try {
            const data = await onAnalyze(
                formData.person_a_file,
                formData.person_b_file,
                formData.name_a,
                formData.name_b,
                formData.date
            );

            dispatch({ type: 'ANALYSIS_SUCCESS', payload: data });

            // Scroll to the results after a short delay to allow rendering
            setTimeout(() => scrollToSection(sectionRefs.results), 100);

        } catch (error) {
            const errorMessage = error.message || "An unexpected error occurred.";
            dispatch({ type: 'ANALYSIS_ERROR', payload: errorMessage });
        }
    }, [scrollToSection]);

    // Function passed to ResultsSection to start a new analysis
    const handleAnalyzeAnother = useCallback(() => {
        dispatch({ type: 'START_ANALYSIS' }); // This will clear the results
        scrollToSection(sectionRefs.upload); // Scroll back to the upload form
    }, [scrollToSection]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 font-sans">
            <NavigationBar />
            <main className="flex-grow w-full">
                <HeroSection scrollToRef={sectionRefs.upload} />

                <UploadSection onAnalyze={handleAnalyze} ref={sectionRefs.upload} loading={loading} />

                {/* Loading indicator */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
                        <span className="ml-3 text-lg font-medium text-blue-700">Processing your analysis...</span>
                    </div>
                )}

                {/* Display backend errors */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto max-w-4xl mb-6" role="alert">
                        <strong className="font-bold">Analysis Error!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                        <button
                            className="absolute top-0 right-0 px-4 py-3"
                            onClick={() => dispatch({ type: 'ANALYSIS_ERROR', payload: null })}
                        >
                            <span className="text-xl">&times;</span>
                        </button>
                    </div>
                )}

                {/* Render results only if available */}
                {analysisResults && (
                    <ProximityResultsSection
                        ref={sectionRefs.results}
                        results={analysisResults}
                        onAnalyzeAnother={handleAnalyzeAnother}
                    />
                )}

                <HowItWorksSection />
                <FeaturesSection />
                <PrivacySection />
            </main>
            <Footer />
        </div>
    );
}