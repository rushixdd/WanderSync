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
            //_client.DefaultRequestHeaders.Add("X-API-Key", "your-very-secret-key");
        }

        [Fact]
        public async Task AnalyzeProximity_ShouldReturnSuccess_WhenValidInput()
        {
            var form = new MultipartFormDataContent();

            var personABytes = await File.ReadAllBytesAsync("TestData/person_a.json");
            var personBBytes = await File.ReadAllBytesAsync("TestData/person_b.json");

            var personAContent = new ByteArrayContent(personABytes);
            personAContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
            form.Add(personAContent, "person_a_file", "person_a.json");

            var personBContent = new ByteArrayContent(personBBytes);
            personBContent.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
            form.Add(personBContent, "person_b_file", "person_b.json");

            form.Add(new StringContent("Person A"), "name_a");
            form.Add(new StringContent("Person B"), "name_b");
            form.Add(new StringContent("2024-07-27"), "date");

            // Act
            var response = await _client.PostAsync("/api/Analytics/proximity", form);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var result = await response.Content.ReadFromJsonAsync<AnalyticsResponseDto>();
            result.Should().NotBeNull();
            result.Summary.PersonA.NumberOfPoints.Should().BeGreaterThan(0);
            result.Encounters.Should().NotBeEmpty();

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task AnalyzeProximity_ShouldReturnBadRequest_WhenPersonAFileMissing()
        {
            var content = CreateMultipartFormData(includeFileA: false);

            var response = await _client.PostAsync("/api/Analytics/proximity", content);

            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task AnalyzeProximity_ShouldReturnBadRequest_WhenJsonIsMalformed()
        {
            var content = CreateMultipartFormData(overrideFilePath: "TestData/malformed.json");

            var response = await _client.PostAsync("/api/Analytics/proximity", content);

            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task AnalyzeProximity_ResponseShouldContainMapLinks()
        {
            var content = CreateMultipartFormData();

            var response = await _client.PostAsync("/api/Analytics/proximity", content);
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var result = await response.Content.ReadFromJsonAsync<AnalyticsResponseDto>();

            result.Maps.Should().NotBeNull();
            result.Maps.SharedMap.Should().Contain("/static/api/shared_map");
            result.Maps.AnimatedMap.Should().Contain("/static/api/animated_map");
        }


        private MultipartFormDataContent CreateMultipartFormData(string? nameA = "Person A", string? nameB = "Person B", string? date = "2024-07-27", bool includeFileA = true, bool includeFileB = true, string? overrideFilePath = null)
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

            if (nameA != null) content.Add(new StringContent(nameA), "name_a");
            if (nameB != null) content.Add(new StringContent(nameB), "name_b");
            if (date != null) content.Add(new StringContent(date), "date");

            return content;
        }
    }
}

