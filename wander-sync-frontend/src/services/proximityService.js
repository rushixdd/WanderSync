// src/services/proximityService.js

/**
 * Sends Google Timeline JSON files and analysis parameters to the backend
 * for proximity analysis.
 *
 * @param {File} person_a_file - The File object for Person A's Google Timeline JSON. (Standardized)
 * @param {File} person_b_file - The File object for Person B's Google Timeline JSON. (Standardized)
 * @param {string} name_a - The name entered for Person A. (Standardized)
 * @param {string} name_b - The name entered for Person B. (Standardized)
 * @param {string} date - The selected analysis date in 'YYYY-MM-DD' format. (Standardized)
 * @returns {Promise<Array<Object>>} A promise that resolves with the analysis results from the backend.
 * @throws {Error} Throws an error if the network request fails or the backend returns an error.
 */
export const onAnalyze = async (
    person_a_file, // Standardized parameter name
    person_b_file, // Standardized parameter name
    name_a,        // Standardized parameter name
    name_b,        // Standardized parameter name
    date           // Standardized parameter name
) => {
    const BACKEND_API_URL = /*import.meta.env.VITE_BACKEND_API_URL ||*/ 'https://localhost:7252/api/Analytics/proximity'; // Ensure your backend URL is correct

    const formData = new FormData();
    // Ensure formData keys exactly match the [FromForm(Name = "...")] attributes in your C# DTO
    formData.append('person_a_file', person_a_file);
    formData.append('person_b_file', person_b_file);
    formData.append('name_a', name_a);
    formData.append('name_b', name_b);
    formData.append('date', date);

    try {
        const response = await fetch(BACKEND_API_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`Backend error: ${response.status} - ${errorData.detail || errorData.message || 'Something went wrong on the server.'}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error uploading timeline data:', error);
        throw new Error(`Failed to upload data: ${error.message}`);
    }
};