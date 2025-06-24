using Microsoft.AspNetCore.Http;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using Xunit;

namespace WanderSync.Tests.Integration
{
    public class AnalyticsControllerTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;

        public AnalyticsControllerTests(CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
            _client.DefaultRequestHeaders.Add("X-API-Key", "your-very-secret-key");
        }

        [Fact]
        public async Task AnalyzeProximity_ShouldReturnSuccess_WhenValidInput()
        {
            // Arrange
            var content = new MultipartFormDataContent();

            var fileA = File.OpenRead("TestData/person_a.json");
            var fileB = File.OpenRead("TestData/person_b.json");

            content.Add(new StreamContent(fileA), "person_a_file", "person_a.json");
            content.Add(new StreamContent(fileB), "person_b_file", "person_b.json");
            content.Add(new StringContent("Test A"), "name_a");
            content.Add(new StringContent("Test B"), "name_b");
            content.Add(new StringContent("2024-07-27"), "date");

            // Act
            var response = await _client.PostAsync("/api/Analytics/proximity", content);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}
