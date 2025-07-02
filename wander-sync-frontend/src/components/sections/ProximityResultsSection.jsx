// src/components/sections/ProximityResultsSection.jsx
import React, { forwardRef } from 'react';

const ProximityResultsSection = forwardRef(({ results, personAName, personBName }, ref) => { // Standardized prop names
    if (!results) {
        return null;
    }

    const { summary, encounters, insight, maps } = results;

    return (
        <section
            ref={ref}
            id="proximity-results" // Unique ID for this section
            className="w-full bg-gradient-to-br from-purple-50 to-pink-50 py-20 px-4 md:px-8 flex flex-col items-center justify-center text-center relative z-10"
        >
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-5xl w-full">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-8">
                    Your Proximity Analysis
                </h2>

                {/* Insight Card */}
                {insight && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-6 rounded-lg mb-10 shadow-md max-w-3xl mx-auto text-left">
                        <h3 className="text-2xl font-semibold mb-3">Relationship Insight</h3>
                        <p className="text-lg">{insight.message}</p>
                        {insight.score && (
                            <p className="mt-2 text-md font-medium">Proximity Score: <span className="font-bold text-blue-700">{insight.score}</span></p>
                        )}
                    </div>
                )}

                {/* Encounters Summary */}
                <div className="mb-10">
                    <h3 className="text-3xl font-semibold text-gray-700 mb-6">
                        Shared Moments ({encounters ? encounters.length : 0})
                    </h3>
                    {encounters && encounters.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {encounters.map((encounter, index) => (
                                <div key={index} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200 text-left">
                                    <p className="font-bold text-lg mb-2 text-purple-700">Encounter {index + 1}</p>
                                    <p><strong>Time A:</strong> {encounter.person_a_time ? new Date(encounter.person_a_time).toString() !== 'Invalid Date' ? new Date(encounter.person_a_time).toLocaleTimeString() : 'Not available' : 'Not available'}</p>
                                    <p><strong>Time B:</strong> {encounter.person_b_time ? new Date(encounter.person_b_time).toString() !== 'Invalid Date' ? new Date(encounter.person_b_time).toLocaleTimeString() : 'Not available' : 'Not available'}</p>
                                    <p><strong>Distance:</strong> {encounter.distance_m ? encounter.distance_m.toFixed(2) : '—'} meters</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-lg text-gray-600">No significant proximity moments found for the selected date.</p>
                    )}
                </div>

                {/* Daily Summaries */}
                {(summary?.person_a || summary?.person_b) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        {summary.person_a && (
                            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg shadow-md text-left">
                                <h3 className="text-2xl font-semibold text-orange-800 mb-3">Summary for {personAName || 'Person A'}</h3> {/* Standardized usage */}
                                <p><strong>Total Distance Traveled:</strong> {summary.person_a.total_distance_km ? summary.person_a.total_distance_km.toFixed(2) : '0.00'} km</p>
                                <p><strong>Average Speed:</strong> {summary.person_a.average_speed_kmh ? summary.person_a.average_speed_kmh.toFixed(2) : '0.00'} km/h</p>
                                <p><strong>Unique Locations:</strong> {summary.person_a.unique_locations}</p>
                            </div>
                        )}
                        {summary.person_b && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-md text-left">
                                <h3 className="text-2xl font-semibold text-green-800 mb-3">Summary for {personBName || 'Person B'}</h3> {/* Standardized usage */}
                                <p><strong>Total Distance Traveled:</strong> {summary.person_b.total_distance_km ? summary.person_b.total_distance_km.toFixed(2) : '0.00'} km</p>
                                <p><strong>Average Speed:</strong> {summary.person_b.average_speed_kmh ? summary.person_b.average_speed_kmh.toFixed(2) : '0.00'} km/h</p>
                                <p><strong>Unique Locations:</strong> {summary.person_b.unique_locations}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Map Links */}
                {maps && (
                    <div className="mt-10">
                        <h3 className="text-3xl font-semibold text-gray-700 mb-6">Interactive Maps</h3>
                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            {maps.shared_map && (
                                <a
                                    href={maps.shared_map}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg flex items-center justify-center"
                                >
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    View Shared Map
                                </a>
                            )}
                            {maps.animated_map && (
                                <a
                                    href={maps.animated_map}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition duration-300 shadow-lg flex items-center justify-center"
                                >
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                    View Animated Map
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
});

export default ProximityResultsSection;