using Microsoft.Extensions.Logging;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using WanderSync.Infrastructure.Services.Interfaces;

namespace WanderSync.Infrastructure.Services
{
    public class NominatimService : IGeocodingService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<NominatimService> _logger;

        // Internal DTO to capture just the part of Nominatim's response we need
        private class NominatimResponseDto
        {
            [JsonPropertyName("display_name")]
            public string? DisplayName { get; set; }
        }

        public NominatimService(HttpClient httpClient, ILogger<NominatimService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            // Nominatim requires a unique User-Agent header
            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("WanderSyncApp/1.0 (your-email@example.com)");
        }

        public async Task<string> GetLocationNameAsync(double latitude, double longitude)
        {
            // The API URL uses standard string formatting for coordinates
            var requestUrl = $"https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat={latitude}&lon={longitude}";

            try
            {
                var response = await _httpClient.GetAsync(requestUrl);
                if (response.IsSuccessStatusCode)
                {
                    var nominatimResponse = await response.Content.ReadFromJsonAsync<NominatimResponseDto>();
                    return nominatimResponse?.DisplayName ?? "Unknown Location";
                }
                else
                {
                    _logger.LogWarning("Nominatim API call failed with status {StatusCode}", response.StatusCode);
                    return "Location not found";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling Nominatim API for coords: {lat}, {lon}", latitude, longitude);
                return "Error fetching location";
            }
        }
    }
}