import React, { forwardRef } from 'react';

const HowItWorksSection = forwardRef((props, ref) => {
    return (
        <section
            ref={ref}
            id="how-it-works"
            className="w-full bg-blue-50 py-20 px-4 md:px-8 flex flex-col items-center justify-center text-center relative z-10"
        >
            <div className="max-w-5xl mx-auto">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-12">
                    How WanderSync Works
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Step 1 */}
                    <div className="bg-white p-8 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-center w-16 h-16 bg-blue-200 rounded-full mx-auto mb-6">
                            <svg className="w-8 h-8 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4">1. Upload Your Timelines</h3>
                        <p className="text-gray-600">Securely upload Google Location History (Timeline JSON) files for two individuals. We guide you through the process.</p>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white p-8 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-center w-16 h-16 bg-purple-200 rounded-full mx-auto mb-6">
                            <svg className="w-8 h-8 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4">2. Analyze Proximity</h3>
                        <p className="text-gray-600">WanderSync's powerful algorithm processes the data for your selected date, pinpointing moments and locations of closest proximity.</p>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-white p-8 rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center justify-center w-16 h-16 bg-green-200 rounded-full mx-auto mb-6">
                            <svg className="w-8 h-8 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4">3. Discover Shared Moments</h3>
                        <p className="text-gray-600">Visualize where and when your paths crossed. Rediscover forgotten encounters and create new memories!</p>
                    </div>
                </div>
            </div>
        </section>
    );
});

export default HowItWorksSection;