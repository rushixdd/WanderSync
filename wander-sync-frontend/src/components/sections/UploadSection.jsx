// src/components/sections/UploadSection.jsx
import React, { useState, forwardRef } from 'react';

// --- Helper Components (Icons & Modal - No changes needed) ---
const UploadCloud = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m16 16-4-4-4 4"></path></svg>
);
const CalendarDays = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg>
);
const HelpCircle = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);

const HelpModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full text-left">
            <h3 className="text-2xl font-bold mb-4">How to Export Your Google Timeline</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Go to <a href="https://takeout.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Google Takeout</a>.</li>
                <li>Click <strong>"Deselect all,"</strong> then scroll down and check the box for <strong>"Location History."</strong></li>
                <li>Ensure the format is set to **JSON**.</li>
                <li>Click <strong>"Next step,"</strong> then <strong>"Create export."</strong></li>
                <li>Google will email you a link to a `.zip` file. Download and unzip it to find your `Timeline.json` file.</li>
            </ol>
            <button onClick={onClose} className="mt-6 w-full bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors">
                Got It
            </button>
        </div>
    </div>
);


// --- Main UploadSection Component ---

const UploadSection = forwardRef(({ onAnalyze, loading }, ref) => {
    const [formData, setFormData] = useState({
        person_a_file: null, person_b_file: null, name_a: '', name_b: '', date: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clientError, setClientError] = useState(null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, [e.target.name]: file });
        if (!file || file.type !== 'application/json') {
            setClientError(`Please upload a valid JSON file for ${e.target.name === 'person_a_file' ? 'Person A' : 'Person B'}.`);
        } else {
            setClientError(null);
        }
    };

    const handleAnalyze = (e) => {
        e.preventDefault();
        setClientError(null);
        const { person_a_file, person_b_file, name_a, name_b, date } = formData;
        if (!person_a_file || !person_b_file || !name_a.trim() || !name_b.trim() || !date) {
            setClientError("Please fill in all fields and upload both JSON files.");
            return;
        }
        onAnalyze(formData);
    };

    return (
        <section ref={ref} id="get-started" className="min-h-screen bg-gray-50 py-20 flex items-center justify-center px-4">
            {isModalOpen && <HelpModal onClose={() => setIsModalOpen(false)} />}
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-5xl w-full">
                {/* --- UPDATED HEADER --- */}
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-extrabold text-gray-800">Start Your Analysis</h2>
                    <p className="text-lg text-gray-500 mt-2">Discover your shared moments in three simple steps.</p>
                </div>

                <form onSubmit={handleAnalyze} className="space-y-10">
                    {clientError && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-md" role="alert">
                            <p className="font-bold">Error:</p>
                            <p>{clientError}</p>
                        </div>
                    )}

                    {/* --- STEP 1 & 2 --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                        {/* Person A Upload */}
                        <div className="space-y-4">
                            {/* --- UPDATED LABEL --- */}
                            <h3 className="text-2xl font-bold text-gray-800">1. First Person's Timeline</h3>
                            <div className="mt-1 flex justify-center px-6 py-10 border-2 border-gray-300 border-dashed rounded-md">
                                <label htmlFor="person_a_file" className="text-center cursor-pointer space-y-1">
                                    <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                                    <p className="text-sm text-gray-600">{formData.person_a_file ? formData.person_a_file.name : <><span className="font-semibold text-blue-600">Click to upload</span><span> or drag & drop</span></>}</p>
                                    <input id="person_a_file" name="person_a_file" type="file" className="sr-only" accept=".json" onChange={handleFileChange} />
                                </label>
                            </div>
                            <div className="relative">
                                <label htmlFor="name_a" className="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" name="name_a" id="name_a" value={formData.name_a} onChange={handleChange} placeholder="e.g., Alex" required className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"/>
                            </div>
                        </div>
                        {/* Person B Upload */}
                        <div className="space-y-4">
                            {/* --- UPDATED LABEL --- */}
                            <h3 className="text-2xl font-bold text-gray-800">2. Second Person's Timeline</h3>
                            <div className="mt-1 flex justify-center px-6 py-10 border-2 border-gray-300 border-dashed rounded-md">
                                <label htmlFor="person_b_file" className="text-center cursor-pointer space-y-1">
                                    <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                                    <p className="text-sm text-gray-600">{formData.person_b_file ? formData.person_b_file.name : <><span className="font-semibold text-purple-600">Click to upload</span><span> or drag & drop</span></>}</p>
                                    <input id="person_b_file" name="person_b_file" type="file" className="sr-only" accept=".json" onChange={handleFileChange} />
                                </label>
                            </div>
                            <div className="relative">
                                <label htmlFor="name_b" className="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" name="name_b" id="name_b" value={formData.name_b} onChange={handleChange} placeholder="e.g., Bailey" required className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"/>
                            </div>
                        </div>
                    </div>

                    {/* --- STEP 3 & SUBMIT --- */}
                    <div className="text-center border-t border-gray-200 pt-10 space-y-4">
                        {/* --- UPDATED LABEL --- */}
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center justify-center">3. Pick the Day
                            <button type="button" onClick={() => setIsModalOpen(true)} className="ml-2 text-gray-400 hover:text-blue-600" title="How to get your timeline file?">
                                <HelpCircle className="w-6 h-6"/>
                            </button>
                        </h3>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block mx-auto px-4 py-3 border border-gray-300 rounded-md shadow-sm w-full max-w-sm text-lg" required />
                    </div>

                    <div className="text-center">
                        <button type="submit" className="w-full max-w-xs py-4 px-8 text-xl font-medium rounded-full text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-500" disabled={loading}>
                            {loading ? 'Analyzing...' : 'Analyze Proximity'}
                        </button>
                        <p className="text-xs text-gray-500 mt-4">🔒 Your files are processed temporarily and never stored.</p>
                    </div>
                </form>
            </div>
        </section>
    );
});

export default UploadSection;