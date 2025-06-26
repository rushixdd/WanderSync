import React from 'react';

// HeroSection component: Displays the app's name, tagline, description, and a call-to-action.
// It includes subtle background SVG graphics for visual appeal.
const HeroSection = ({ scrollToRef }) => {
    return (
        <section className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900 overflow-hidden">
            {/* Background SVG paths for subtle dynamic effect */}
            {/* These paths are designed to create a sense of movement and connection */}
            <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 150 C 300 50, 700 250, 900 150" stroke="url(#gradient1)" strokeWidth="2" strokeDasharray="5 5" />
                <path d="M900 850 C 700 950, 300 750, 100 850" stroke="url(#gradient2)" strokeWidth="2" strokeDasharray="5 5" />
                <path d="M50 500 C 200 400, 800 600, 950 500" stroke="url(#gradient3)" strokeWidth="2" strokeDasharray="5 5" />
                <defs>
                    {/* Gradients for the SVG paths, adding a modern aesthetic */}
                    <linearGradient id="gradient1" x1="100" y1="150" x2="900" y2="150" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6EE7B7" /> {/* Teal */}
                        <stop offset="1" stopColor="#3B82F6" /> {/* Blue */}
                    </linearGradient>
                    <linearGradient id="gradient2" x1="900" y1="850" x2="100" y2="850" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#8B5CF6" /> {/* Purple */}
                        <stop offset="1" stopColor="#EC4899" /> {/* Pink */}
                    </linearGradient>
                    <linearGradient id="gradient3" x1="50" y1="500" x2="950" y2="500" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#F97316" /> {/* Orange */}
                        <stop offset="1" stopColor="#EF4444" /> {/* Red */}
                    </linearGradient>
                </defs>
            </svg>

            <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
                <h1 className="text-6xl font-extrabold mb-4 animate-fade-in-up">WanderSync</h1>
                <p className="text-2xl text-gray-700 mb-6 font-light animate-fade-in-up delay-200">
                    “When paths cross, stories unfold.”
                </p>
                <p className="text-lg text-gray-600 mb-8 animate-fade-in-up delay-400">
                    Upload your Google Timeline data and let WanderSync uncover the moments when two lives aligned.
                </p>
                {/* Call-to-action button that scrolls the user to the upload form */}
                <button
                    onClick={scrollToRef}
                    className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 animate-fade-in-up delay-600"
                >
                    Get Started
                </button>
            </div>
        </section>
    );
};

export default HeroSection;
