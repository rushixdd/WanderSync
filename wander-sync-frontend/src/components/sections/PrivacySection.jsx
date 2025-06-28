// src/components/sections/PrivacySection.jsx
import React, { forwardRef } from 'react';

const PrivacySection = forwardRef((props, ref) => {
    return (
        <section
            ref={ref}
            id="privacy"
            className="w-full bg-gray-100 py-20 px-4 md:px-8 flex flex-col items-center justify-center text-center relative z-10"
        >
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-8">
                    Your Privacy, Our Priority
                </h2>
                <p className="text-lg text-gray-700 mb-8">
                    At WanderSync, we understand the sensitivity of your location data. Our commitment is to ensure your information is handled with the utmost care and transparency.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-3">Data Security</h3>
                        <p className="text-gray-600">Your uploaded Google Timeline JSON files are processed securely on our backend. We use industry-standard encryption and security protocols to protect your data during transmission and processing.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-3">Temporary Processing</h3>
                        <p className="text-gray-600">WanderSync is designed for **temporary processing only**. We do not store your raw Google Timeline JSON files or your detailed location history after the analysis is complete. All uploaded data is immediately discarded once your proximity results are generated.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Third-Party Sharing</h3>
                        <p className="text-gray-600">We do not share, sell, or distribute your personal location data with any third parties for marketing, advertising, or any other purposes. Your data is solely used to provide you with the WanderSync service.</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-3">User Control</h3>
                        <p className="text-gray-600">You are in complete control of your data. You choose which files to upload and for which analysis date. If you have any concerns, please contact us.</p>
                    </div>
                </div>
                <p className="text-md text-gray-500 mt-10">
                    For more detailed information, please refer to our full Privacy Policy (link to be added).
                </p>
            </div>
        </section>
    );
});

export default PrivacySection;