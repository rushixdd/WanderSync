// src/components/sections/UploadSection.jsx
import React, { useState, forwardRef } from 'react';
import InputField from '../common/InputField.jsx'; // Import the reusable InputField component

// Placeholder SVG for UploadCloud icon (mimicking lucide-react)
const UploadCloud = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-upload-cloud">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
        <path d="M12 12v9"></path>
        <path d="m16 16-4-4-4 4"></path>
    </svg>
);

// Placeholder SVG for Calendar icon (mimicking lucide-react)
const Calendar = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
        <line x1="16" x2="16" y1="2" y2="6"></line>
        <line x1="8" x2="8" y1="2" y2="6"></line>
        <line x1="3" x2="21" y1="10" y2="10"></line>
    </svg>
);

// UploadSection component: Contains the form for users to upload files and input details.
// It uses React.forwardRef to allow the parent component (LandingPage) to scroll to it.
// Now accepts an onAnalyze prop to trigger the backend analysis.
const UploadSection = forwardRef(({ onAnalyze, loading }, ref) => { // Destructure loading prop
    // Standardized state variable names
    const [person_a_file, setPerson_a_file] = useState(null);
    const [person_b_file, setPerson_b_file] = useState(null);
    const [name_a, setName_a] = useState('');
    const [name_b, setName_b] = useState('');
    const [date, setDate] = useState('');
    const [clientError, setClientError] = useState(null); // For client-side validation errors

    // Handlers for file input changes
    const handleFileAChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/json') {
            setPerson_a_file(file);
            setClientError(null);
        } else {
            setPerson_a_file(null);
            setClientError('Please upload a valid JSON file for Person A.');
        }
    };

    const handleFileBChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/json') {
            setPerson_b_file(file);
            setClientError(null);
        } else {
            setPerson_b_file(null);
            setClientError('Please upload a valid JSON file for Person B.');
        }
    };

    // Handler for the form submission
    const handleAnalyze = (e) => {
        e.preventDefault();
        setClientError(null); // Clear previous client errors

        // Basic client-side validation using standardized names
        if (!person_a_file || !person_b_file || !name_a.trim() || !name_b.trim() || !date) {
            setClientError("Please fill in all fields and upload both JSON files.");
            return;
        }

        // Call the onAnalyze prop, passing all form data with standardized keys
        onAnalyze({
            person_a_file, // Now matches backend
            person_b_file, // Now matches backend
            name_a,        // Now matches backend
            name_b,        // Now matches backend
            date,          // Now matches backend
        });
    };

    return (
        <section ref={ref} id="get-started" className="min-h-screen bg-gray-50 py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl w-full">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Uncover Shared Journeys</h2>
                <form onSubmit={handleAnalyze} className="space-y-8">
                    {/* Client-side error display */}
                    {clientError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {clientError}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Person A Upload Column */}
                        <div className="flex flex-col space-y-4 min-w-0">
                            <label htmlFor="fileA" className="block text-xl font-medium text-gray-700">
                                <UploadCloud className="inline-block mr-2 text-blue-500" />
                                Upload JSON for Person A
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-400 transition-colors duration-200">
                                <input
                                    id="fileA"
                                    name="person_a_file" // Matching backend name
                                    type="file"
                                    className="sr-only"
                                    accept=".json"
                                    onChange={handleFileAChange} // Use new handler
                                />
                                <label htmlFor="fileA" className="text-center w-full h-full flex flex-col items-center justify-center cursor-pointer">
                                    <p className="text-sm text-gray-600">
                                        {person_a_file ? person_a_file.name : "Drag and drop or click to upload"}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">Google Timeline JSON (max 10MB recommended)</p>
                                </label>
                            </div>
                            <InputField
                                id="name_a"
                                label="Name for Person A"
                                type="text"
                                placeholder="e.g., Alex"
                                value={name_a} // Standardized name
                                onChange={(e) => setName_a(e.target.value)} // Standardized setter
                                required={true}
                            />
                        </div>

                        {/* Person B Upload Column */}
                        <div className="flex flex-col space-y-4 min-w-0">
                            <label htmlFor="fileB" className="block text-xl font-medium text-gray-700">
                                <UploadCloud className="inline-block mr-2 text-purple-500" />
                                Upload JSON for Person B
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-purple-400 transition-colors duration-200">
                                <input
                                    id="fileB"
                                    name="person_b_file" // Matching backend name
                                    type="file"
                                    className="sr-only"
                                    accept=".json"
                                    onChange={handleFileBChange} // Use new handler
                                />
                                <label htmlFor="fileB" className="text-center w-full h-full flex flex-col items-center justify-center cursor-pointer">
                                    <p className="text-sm text-gray-600">
                                        {person_b_file ? person_b_file.name : "Drag and drop or click to upload"}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">Google Timeline JSON (max 10MB recommended)</p>
                                </label>
                            </div>
                            <InputField
                                id="name_b"
                                label="Name for Person B"
                                type="text"
                                placeholder="e.g., Bailey"
                                value={name_b} // Standardized name
                                onChange={(e) => setName_b(e.target.value)} // Standardized setter
                                required={true}
                            />
                        </div>
                    </div>

                    {/* Date Picker */}
                    <div className="text-center mt-8">
                        <label htmlFor="selectedDate" className="block text-xl font-medium text-gray-700 mb-4">
                            <Calendar className="inline-block mr-2 text-green-500" />
                            Select a Date to Analyze
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date" // Matching backend name
                            value={date} // Standardized name
                            onChange={(e) => setDate(e.target.value)} // Standardized setter
                            className="mt-1 block mx-auto px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-lg w-full max-w-sm"
                            required
                        />
                    </div>

                    {/* Analyze Proximity Button */}
                    <div className="text-center mt-10">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-4 px-12 border border-transparent shadow-sm text-xl font-medium rounded-full text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                            disabled={loading} // Disable button while analysis is in progress
                        >
                            {loading ? 'Analyzing...' : 'Analyze Proximity'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
});

export default UploadSection;