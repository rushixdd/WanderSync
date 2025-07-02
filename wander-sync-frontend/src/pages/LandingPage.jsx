// src/pages/LandingPage.jsx
import React, { useRef, useReducer, useCallback } from 'react';
import HeroSection from '../components/sections/HeroSection.jsx';
import UploadSection from '../components/sections/UploadSection.jsx'; // Your provided UploadSection
import HowItWorksSection from '../components/sections/HowItWorksSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import PrivacySection from '../components/sections/PrivacySection';
import ProximityResultsSection from '../components/sections/ProximityResultsSection'; // Import the new results component
import Footer from '../components/layouts/Footer.jsx';
import NavigationBar from '../components/layouts/NavigationBar';
import { onAnalyze } from '../services/proximityService'; // Import the service function

// LandingPage component: Orchestrates the main sections of the landing page.
export default function LandingPage() {
    // Refs for scrolling to specific sections organized into a single object
    const sectionRefs = {
        upload: useRef(null),
        howItWorks: useRef(null),
        features: useRef(null),
        privacy: useRef(null),
        results: useRef(null)
    };

    // Reducer for managing analysis state
    const initialState = {
        analysisResults: null,
        personAName: '',
        personBName: '',
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
                    analysisResults: null,
                    personAName: '',
                    personBName: ''
                };
            case 'ANALYSIS_SUCCESS':
                return {
                    ...state,
                    loading: false,
                    analysisResults: action.payload.results,
                    personAName: action.payload.personAName,
                    personBName: action.payload.personBName
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
    const { analysisResults, personAName, personBName, loading, error } = state;

    // Function to smoothly scroll to any ref
    const scrollToSection = useCallback((ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    // This is the function passed to UploadSection's onAnalyze prop
    const handleAnalyze = useCallback(async ({ person_a_file, person_b_file, name_a, name_b, date }) => {
        dispatch({ type: 'START_ANALYSIS' });

        try {
            const data = await onAnalyze(
                person_a_file,
                person_b_file,
                name_a,
                name_b,
                date
            );
            console.log("Backend analysis results:", data);
            
            dispatch({
                type: 'ANALYSIS_SUCCESS',
                payload: {
                    results: data,
                    personAName: name_a,
                    personBName: name_b
                }
            });
            
            // Scroll to the results section after successful analysis
            scrollToSection(sectionRefs.results);
        } catch (error) {
            console.error("Backend analysis failed:", error);
            const errorMessage = error.message || "An unexpected error occurred during analysis.";
            dispatch({ type: 'ANALYSIS_ERROR', payload: errorMessage });
        }
    }, [scrollToSection]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 font-sans">
            <NavigationBar />
            <main className="flex-grow w-full">
                <HeroSection scrollToRef={sectionRefs.upload} />

                {/* Pass handleAnalyze and loading state to UploadSection */}
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
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline"> {error}</span>
                        <button 
                            className="absolute top-0 right-0 px-4 py-3"
                            onClick={() => dispatch({ type: 'ANALYSIS_ERROR', payload: null })}
                        >
                            <span className="sr-only">Close</span>
                            <span className="text-xl">&times;</span>
                        </button>
                    </div>
                )}

                {/* Render results only if available */}
                {analysisResults && (
                    <ProximityResultsSection
                        ref={sectionRefs.results}
                        results={analysisResults}
                        personAName={personAName}
                        personBName={personBName}
                    />
                )}

                <HowItWorksSection ref={sectionRefs.howItWorks} />
                <FeaturesSection ref={sectionRefs.features} />
                <PrivacySection ref={sectionRefs.privacy} />
            </main>
            <Footer />
        </div>
    );
}