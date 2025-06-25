using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using WanderSync.Application.DTOs;
using WanderSync.Infrastructure.Services.Interfaces;

namespace WanderSync.Infrastructure.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly HttpClient _httpClient;
        private const string PythonApiKey = "your-very-secret-key";

        public AnalyticsService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<AnalyticsResponseDto> AnalyzeProximityAsync(AnalyticsRequestDto request)
        {
            using var content = new MultipartFormDataContent();

            var personAStream = new StreamContent(request.PersonAFile.OpenReadStream());
            personAStream.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            content.Add(personAStream, "person_a_file", request.PersonAFile.FileName);

            var personBStream = new StreamContent(request.PersonBFile.OpenReadStream());
            personBStream.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            content.Add(personBStream, "person_b_file", request.PersonBFile.FileName);

            content.Add(new StringContent(request.NameA), "name_a");
            content.Add(new StringContent(request.NameB), "name_b");
            content.Add(new StringContent(request.Date), "date");
            var response = await _httpClient.PostAsync("analyze", content);

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<AnalyticsResponseDto>();
                return result;
            }
            else if (response.StatusCode == HttpStatusCode.BadRequest)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new InvalidOperationException($"Analytics service rejected input: {error}");
            }
            else
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new HttpRequestException("Failed to analyze proximity due to analytics server error.");
            }

        }
    }
}
