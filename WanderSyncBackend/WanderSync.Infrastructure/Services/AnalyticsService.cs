using Microsoft.Extensions.Logging;
using System.Net;
using System.Net.Http.Json;
using WanderSync.Application.DTOs;
using WanderSync.Application.DTOs.Internal;
using WanderSync.Infrastructure.Services.Interfaces;

namespace WanderSync.Infrastructure.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly HttpClient _pythonApiClient;
        private readonly IGeocodingService _geocodingService;
        private readonly ILogger<AnalyticsService> _logger;

        public AnalyticsService(
            HttpClient httpClient,
            IGeocodingService geocodingService,
            ILogger<AnalyticsService> logger)
        {
            _pythonApiClient = httpClient;
            _geocodingService = geocodingService;
            _logger = logger;
        }

        public async Task<AnalyticsResponseDto> AnalyzeProximityAsync(AnalyticsRequestDto request)
        {
            // Step 1: Call the Python service to get the core analysis
            var pythonResponse = await GetAnalyticsFromPythonAsync(request);

            // Step 2: Enrich the data with geocoding
            var finalResponse = await EnrichWithGeocodingAsync(pythonResponse);

            return finalResponse;
        }

        private async Task<PythonAnalyticsResponse> GetAnalyticsFromPythonAsync(AnalyticsRequestDto request)
        {
            _logger.LogInformation("Calling Python analytics service...");
            using var content = new MultipartFormDataContent();

            // Add files and form data to the request
            content.Add(new StreamContent(request.PersonAFile.OpenReadStream()), "person_a_file", request.PersonAFile.FileName);
            content.Add(new StreamContent(request.PersonBFile.OpenReadStream()), "person_b_file", request.PersonBFile.FileName);
            content.Add(new StringContent(request.NameA), "name_a");
            content.Add(new StringContent(request.NameB), "name_b");
            content.Add(new StringContent(request.Date), "date");

            var response = await _pythonApiClient.PostAsync("analyze", content);

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<PythonAnalyticsResponse>();
                if (result == null)
                    throw new InvalidOperationException("Failed to deserialize response from analytics service.");

                _logger.LogInformation("Successfully received analytics from Python service.");
                return result;
            }

            var error = await response.Content.ReadAsStringAsync();
            _logger.LogError("Python service returned an error. Status: {StatusCode}, Body: {ErrorBody}", response.StatusCode, error);

            if (response.StatusCode == HttpStatusCode.BadRequest || response.StatusCode == HttpStatusCode.NotFound)
            {
                throw new InvalidOperationException($"Analytics service rejected input: {error}");
            }

            throw new HttpRequestException("Failed to analyze proximity due to an analytics server error.");
        }

        private async Task<AnalyticsResponseDto> EnrichWithGeocodingAsync(PythonAnalyticsResponse pythonResponse)
        {
            _logger.LogInformation("Starting geocoding enrichment...");

            // Enrich Moments of Connection
            foreach (var moment in pythonResponse.ClusteredMoments)
            {
                var locationName = await _geocodingService.GetLocationNameAsync(moment.LocationCoords[0], moment.LocationCoords[1]);
                moment.Location = new LocationDetailsDto { Name = locationName };
            }

            // Enrich Individual Summaries
            foreach (var summary in pythonResponse.IndividualSummaries.Values)
            {
                if (summary.MostFrequentLocationCoords != null)
                {
                    var locationName = await _geocodingService.GetLocationNameAsync(summary.MostFrequentLocationCoords[0], summary.MostFrequentLocationCoords[1]);
                    summary.MostFrequentLocationName = locationName;
                }
            }

            _logger.LogInformation("Geocoding enrichment complete.");

            // Map the enriched Python response to the final DTO for the frontend
            return new AnalyticsResponseDto
            {
                Insight = pythonResponse.Insight,
                IndividualSummaries = pythonResponse.IndividualSummaries,
                MomentsOfConnection = pythonResponse.ClusteredMoments,
                Maps = pythonResponse.Maps
            };
        }
    }
}