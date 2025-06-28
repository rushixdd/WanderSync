// src/components/sections/FeaturesSection.jsx
import React, { forwardRef } from 'react';

const FeaturesSection = forwardRef((props, ref) => {
    return (
        <section
            ref={ref}
            id="features"
            className="w-full bg-white py-20 px-4 md:px-8 flex flex-col items-center justify-center text-center relative z-10"
        >
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-8">
                    Expanding Your Discoveries
                </h2>
                <p className="text-xl text-gray-600 mb-12">
                    WanderSync is continuously evolving to bring you more insights and richer experiences.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                    {/* Feature 1 */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md border-t-4 border-blue-500">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-3">Interactive Maps</h3>
                        <p className="text-gray-600">Visualize proximity points on a dynamic map interface, seeing exactly where the magic happened.</p>
                        <span className="inline-block mt-4 text-sm font-bold text-blue-500">Coming Soon!</span>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md border-t-4 border-purple-500">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-3">Detailed Analytics</h3>
                        <p className="text-gray-600">Dive deeper with graphs and statistics on frequency, closest distances, and time spent in proximity.</p>
                        <span className="inline-block mt-4 text-sm font-bold text-purple-500">Coming Soon!</span>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md border-t-4 border-green-500">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-3">Event Matching</h3>
                        <p className="text-gray-600">Sync with your calendar to automatically identify shared events that align with your location data.</p>
                        <span className="inline-block mt-4 text-sm font-bold text-green-500">Future Plan</span>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
                        <h3 className="text-2xl font-semibold text-gray-700 mb-3">Privacy Controls</h3>
                        <p className="text-gray-600">Even more granular control over your data and sharing preferences.</p>
                        <span className="inline-block mt-4 text-sm font-bold text-yellow-500">Ongoing Development</span>
                    </div>
                </div>
            </div>
        </section>
    );
});

export default FeaturesSection;