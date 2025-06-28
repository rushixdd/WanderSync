// src/components/layouts/NavigationBar.jsx
import React from 'react';

// NavigationBar component receives props for scrolling
const NavigationBar = () => {
    return (
        <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-90 backdrop-blur-sm z-50 shadow-md p-4 flex justify-center space-x-8">
            <a
                href="#"
                className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
                onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            >
                Home
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                How It Works
            </a>
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Features
            </a>
            <a href="#privacy" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                Privacy
            </a>
        </nav>
    );
};

export default NavigationBar;