import React, { useState } from 'react';
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
const UploadSection = React.forwardRef(({ onAnalyze }, ref) => { // Destructure onAnalyze from props
    const [personAFile, setPersonAFile] = useState(null);
    const [personBFile, setPersonBFile] = useState(null);
    const [personAName, setPersonAName] = useState('');
    const [personBName, setPersonBName] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    // Handler for the form submission
    const handleAnalyze = (e) => {
        e.preventDefault();

        // Basic client-side validation
        if (!personAFile || !personBFile || !personAName || !personBName || !selectedDate) {
            alert("Please fill in all fields and upload both files.");
            return;
        }

        // Call the onAnalyze prop, passing all form data
        // The App.jsx parent component will then handle the backend call and navigation
        onAnalyze({
            personAFile,
            personBFile,
            personAName,
            personBName,
            selectedDate,
        });
    };

    return (
        <section ref={ref} className="min-h-screen bg-gray-50 py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl w-full">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Uncover Shared Journeys</h2>
                <form onSubmit={handleAnalyze} className="space-y-8">
                    {/* This grid container should correctly apply the two-column layout */}
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
                        {/* Person A Upload Column */}
                        {/* Added min-w-0 to allow the column to shrink if content pushes it */}
                        <div className="flex flex-col space-y-4 min-w-0">
                            <label htmlFor="fileA" className="block text-xl font-medium text-gray-700">
                                <UploadCloud className="inline-block mr-2 text-blue-500" />
                                Upload JSON for Person A
                            </label>
                            {/* Custom styled file input - Ensure inner label is w-full */}
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-400 transition-colors duration-200">
                                <input
                                    id="fileA"
                                    name="fileA"
                                    type="file"
                                    className="sr-only" // Hide native input
                                    accept=".json" // Only accept JSON files
                                    onChange={(e) => setPersonAFile(e.target.files[0])}
                                />
                                {/* Added w-full to the inner label to ensure it takes available space */}
                                <label htmlFor="fileA" className="text-center w-full h-full flex flex-col items-center justify-center cursor-pointer">
                                    <p className="text-sm text-gray-600">
                                        {personAFile ? personAFile.name : "Drag and drop or click to upload"}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">Google Timeline JSON (max 10MB recommended)</p>
                                </label>
                            </div>
                            {/* Reusable InputField for Person A's name */}
                            <InputField
                                id="nameA"
                                label="Name for Person A"
                                type="text"
                                placeholder="e.g., Alex"
                                value={personAName}
                                onChange={(e) => setPersonAName(e.target.value)}
                                required={true}
                            />
                        </div>

                        {/* Person B Upload Column */}
                        {/* Added min-w-0 to allow the column to shrink if content pushes it */}
                        <div className="flex flex-col space-y-4 min-w-0">
                            <label htmlFor="fileB" className="block text-xl font-medium text-gray-700">
                                <UploadCloud className="inline-block mr-2 text-purple-500" />
                                Upload JSON for Person B
                            </label>
                            {/* Custom styled file input - Ensure inner label is w-full */}
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-purple-400 transition-colors duration-200">
                                <input
                                    id="fileB"
                                    name="fileB"
                                    type="file"
                                    className="sr-only" // Hide native input
                                    accept=".json"
                                    onChange={(e) => setPersonBFile(e.target.files[0])}
                                />
                                {/* Added w-full to the inner label to ensure it takes available space */}
                                <label htmlFor="fileB" className="text-center w-full h-full flex flex-col items-center justify-center cursor-pointer">
                                    <p className="text-sm text-gray-600">
                                        {personBFile ? personBFile.name : "Drag and drop or click to upload"}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">Google Timeline JSON (max 10MB recommended)</p>
                                </label>
                            </div>
                            {/* Reusable InputField for Person B's name */}
                            <InputField
                                id="nameB"
                                label="Name for Person B"
                                type="text"
                                placeholder="e.g., Bailey"
                                value={personBName}
                                onChange={(e) => setPersonBName(e.target.value)}
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
                            id="selectedDate"
                            name="selectedDate"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="mt-1 block mx-auto px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-lg w-full max-w-sm"
                            required
                        />
                    </div>

                    {/* Analyze Proximity Button */}
                    <div className="text-center mt-10">
                        <button
                            type="submit"
                            className="inline-flex justify-center py-4 px-12 border border-transparent shadow-sm text-xl font-medium rounded-full text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
                        >
                            Analyze Proximity
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
});

export default UploadSection;
