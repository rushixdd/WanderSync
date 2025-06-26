// src/services/proximityService.js

// This file will contain functions responsible for making API calls to your backend.
// It abstracts the fetch/axios logic away from your React components.

// Get the backend API base URL from environment variables.
// In a Vite app, environment variables prefixed with VITE_ are exposed to client-side code.
const API_BASE_URL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8000/api'; // Default to localhost:8000 if not set

/**
 * Uploads Google Timeline JSON files and analysis parameters to the backend.
 * @param {File} personAFile - The JSON file for Person A.
 * @param {File} personBFile - The JSON file for Person B.
 * @param {string} personAName - Name of Person A.
 * @param {string} personBName - Name of Person B.
 * @param {string} analysisDate - The date for analysis (e.g., 'YYYY-MM-DD').
 * @returns {Promise<Array>} - A promise that resolves to the analysis results from the backend.
 */
export const uploadTimelineData = async (
    personAFile,
    personBFile,
    personAName,
    personBName,
    analysisDate
) => {
    // Create a FormData object to send files and other data
    const formData = new FormData();
    formData.append('personA_file', personAFile);
    formData.append('personB_file', personBFile);
    formData.append('personA_name', personAName);
    formData.append('personB_name', personBName);
    formData.append('analysis_date', analysisDate);

    try {
        const response = await fetch(`${API_BASE_URL}/analyze-proximity`, {
            method: 'POST',
            body: formData, // No Content-Type header needed for FormData; browser sets it.
        });

        if (!response.ok) {
            // If the response is not OK (e.g., 4xx or 5xx status)
            const errorData = await response.json(); // Attempt to read error message from backend
            throw new Error(errorData.detail || 'Failed to analyze proximity data.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error uploading timeline data:', error);
        throw error; // Re-throw to be handled by the component
    }
};

// You can add more service functions here as your app grows,
// e.g., for fetching results, managing user data, etc.
