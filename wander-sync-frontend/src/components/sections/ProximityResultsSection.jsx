import React, { forwardRef } from 'react';

// Helper icons (placeholders, you can use a library like lucide-react)
const MapPin = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const Clock = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const Zap = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;

// Helper to format duration from seconds to a readable string
const formatDuration = (seconds) => {
    if (seconds < 60) return "< 1 min";
    return `${Math.round(seconds / 60)} min`;
};

const ProximityResultsSection = forwardRef(({ results, onAnalyzeAnother }, ref) => {
    if (!results) return null;

    // Deconstruct the new, enriched data structure
    const { insight, individual_summaries, moments_of_connection, maps } = results;

    return (
        <section ref={ref} id="proximity-results" className="w-full bg-slate-50 py-20 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-5xl w-full mx-auto">

                {/* 1. Connection Story (Hero Insight) */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold text-gray-800 mb-2">{insight.title}</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">{insight.narrative}</p>
                    <div className="mt-6">
                        <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                            {insight.connection_score}
                        </span>
                        <p className="text-sm text-gray-500 uppercase font-semibold tracking-wider mt-1">Connection Score</p>
                    </div>
                </div>

                {/* 2. Moments of Connection (Timeline) */}
                <div className="mb-12">
                    <h3 className="text-3xl font-bold text-gray-700 mb-8 text-center">Moments of Connection ({moments_of_connection.length})</h3>
                    <div className="space-y-6">
                        {moments_of_connection.map((moment, index) => (
                            <div key={index} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <div className="md:col-span-2">
                                    <h4 className="font-bold text-lg mb-2 text-purple-700 flex items-center">
                                        <MapPin className="w-5 h-5 mr-2" />
                                        {moment.location.name}
                                    </h4>
                                    <p className="text-sm text-gray-500 ml-7">{moment.location.hint || ''}</p>
                                </div>
                                <div className="text-left md:text-right text-sm text-gray-600 space-y-1">
                                    <p><strong>Time:</strong> {new Date(moment.start_time_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    <p><strong>Duration:</strong> {formatDuration(moment.duration_seconds)}</p>
                                    <p><strong>Avg. Distance:</strong> {moment.average_distance_meters.toFixed(1)}m</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Your Day (Individual Summaries) */}
                <div className="mb-12">
                    <h3 className="text-3xl font-bold text-gray-700 mb-8 text-center">Your Day</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {Object.entries(individual_summaries).map(([personKey, summary]) => (
                            <div key={personKey} className={`p-6 rounded-lg shadow-md text-left ${personKey === 'person_a' ? 'bg-orange-50 border-l-4 border-orange-500' : 'bg-green-50 border-l-4 border-green-500'}`}>
                                <h4 className={`text-2xl font-semibold mb-4 ${personKey === 'person_a' ? 'text-orange-800' : 'text-green-800'}`}>
                                    {personKey === 'person_a' ? 'Summary for Person A' : 'Summary for Person B'}
                                </h4>
                                <ul className="space-y-2 text-gray-700">
                                    <li><strong>Distance:</strong> {summary.total_distance_km.toFixed(1)} km</li>
                                    <li><strong>Time Moving:</strong> {formatDuration(summary.time_moving_minutes * 60)}</li>
                                    <li><strong>Avg. Speed:</strong> {summary.average_speed_kmh.toFixed(1)} km/h</li>
                                    <li><strong>Most Visited:</strong> {summary.most_frequent_location_name || 'N/A'}</li>
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. What's Next (Actions & Maps) */}
                <div>
                    <h3 className="text-3xl font-bold text-gray-700 mb-8 text-center">Explore Further</h3>
                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        <button onClick={onAnalyzeAnother} className="bg-gray-700 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition duration-300 shadow-lg flex items-center justify-center">
                            <Zap className="w-6 h-6 mr-2"/>
                            Analyze Another Day
                        </button>
                        <a href={maps.shared_map} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 mr-2"/>
                            View Shared Map
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
});

export default ProximityResultsSection;