using FluentAssertions;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using WanderSync.Application.DTOs;

namespace WanderSync.Tests.Integration
{
    public class AnalyticsControllerTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;

        public AnalyticsControllerTests(CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
            // In a real integration test, the WebApplicationFactory would be configured
            // to mock the IAnalyticsService or the HttpMessageHandler to avoid
            // making real calls to the Python service during tests.
            // For this example, we assume the factory provides a client that gets a valid mock response.
        }

        [Fact]
        public async Task AnalyzeProximity_ShouldReturnSuccess_WhenValidInput()
        {
            // Arrange
            var form = CreateMultipartFormData();

            // Act
            var response = await _client.PostAsync("/api/Analytics/proximity", form);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var result = await response.Content.ReadFromJsonAsync<AnalyticsResponseDto>();
            result.Should().NotBeNull();

            // --- UPDATED ASSERTIONS ---
            // Check the new 'IndividualSummaries' property
            result.IndividualSummaries.Should().ContainKey("person_a");
            result.IndividualSummaries["person_a"].TotalDistanceKm.Should().BeGreaterThanOrEqualTo(0);

            // Check the new 'MomentsOfConnection' property
            result.MomentsOfConnection.Should().NotBeNull();

            // Check the insight object
            result.Insight.Should().NotBeNull();
            result.Insight.ConnectionScore.Should().BeGreaterThanOrEqualTo(0);
        }

        [Fact]
        public async Task AnalyzeProximity_ResponseShouldContainMapLinks()
        {
            // Arrange
            var content = CreateMultipartFormData();

            // Act
            var response = await _client.PostAsync("/api/Analytics/proximity", content);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var result = await response.Content.ReadFromJsonAsync<AnalyticsResponseDto>();

            result.Maps.Should().NotBeNull();
            result.Maps.SharedMap.Should().NotBeNullOrEmpty();
            result.Maps.AnimatedMap.Should().NotBeNullOrEmpty();
        }

        // --- No changes needed for the error case tests below, as they only check status codes ---

        [Fact]
        public async Task AnalyzeProximity_ShouldReturnBadRequest_WhenPersonAFileMissing()
        {
            var content = CreateMultipartFormData(includeFileA: false);
            var response = await _client.PostAsync("/api/Analytics/proximity", content);
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        // Note: This test's success depends on how the underlying Python service is mocked.
        // If it's a true end-to-end test, this would validate the entire flow.
        [Fact]
        public async Task AnalyzeProximity_ShouldReturnBadRequest_WhenJsonIsMalformed()
        {
            var content = CreateMultipartFormData(overrideFilePath: "TestData/malformed.json");
            var response = await _client.PostAsync("/api/Analytics/proximity", content);

            // The expected status code could be BadRequest or another server error,
            // depending on where the failure is caught. BadRequest is a reasonable expectation.
            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        // Helper method to create form data
        private MultipartFormDataContent CreateMultipartFormData(bool includeFileA = true, bool includeFileB = true, string? overrideFilePath = null)
        {
            var content = new MultipartFormDataContent();

            if (includeFileA)
            {
                var filePath = overrideFilePath ?? "TestData/person_a.json";
                var stream = File.OpenRead(filePath);
                content.Add(new StreamContent(stream) { Headers = { ContentType = new MediaTypeHeaderValue("application/json") } }, "person_a_file", Path.GetFileName(filePath));
            }

            if (includeFileB)
            {
                var filePath = overrideFilePath ?? "TestData/person_b.json";
                var stream = File.OpenRead(filePath);
                content.Add(new StreamContent(stream) { Headers = { ContentType = new MediaTypeHeaderValue("application/json") } }, "person_b_file", Path.GetFileName(filePath));
            }

            content.Add(new StringContent("Person A"), "name_a");
            content.Add(new StringContent("Person B"), "name_b");
            content.Add(new StringContent("2024-07-27"), "date");

            return content;
        }
    }
}