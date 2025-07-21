using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;
using System.Net;
using System.Net.Http.Json;
using WanderSync.Application.DTOs;
using WanderSync.Application.DTOs.Internal;
using WanderSync.Infrastructure.Services;
using WanderSync.Infrastructure.Services.Interfaces;

namespace WanderSync.Tests.Unit.Services
{
    public class AnalyticsServiceTests
    {
        private readonly Mock<HttpMessageHandler> _mockPythonApiHandler;
        private readonly Mock<IGeocodingService> _mockGeocodingService;
        private readonly Mock<ILogger<AnalyticsService>> _mockLogger;
        private readonly AnalyticsService _service;

        public AnalyticsServiceTests()
        {
            // Setup mocks for all dependencies
            _mockPythonApiHandler = new Mock<HttpMessageHandler>();
            _mockGeocodingService = new Mock<IGeocodingService>();
            _mockLogger = new Mock<ILogger<AnalyticsService>>();

            // Create an HttpClient that uses our mocked handler
            var httpClient = new HttpClient(_mockPythonApiHandler.Object)
            {
                BaseAddress = new Uri("http://test-python-api/")
            };

            // Instantiate the service with all mocked dependencies
            _service = new AnalyticsService(httpClient, _mockGeocodingService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task AnalyzeProximityAsync_ShouldReturnEnrichedResponse_WhenApisSucceed()
        {
            // --- ARRANGE ---

            // 1. Mock the response from the Python Analytics Service
            var pythonResponse = new PythonAnalyticsResponse
            {
                Insight = new InsightDto { ConnectionScore = 85, Title = "A Good Day" },
                ClusteredMoments = new List<MomentDto>
                {
                    new MomentDto { LocationCoords = new List<double> { 10.0, 20.0 } }
                },
                IndividualSummaries = new Dictionary<string, IndividualSummaryDto>
                {
                    ["person_a"] = new IndividualSummaryDto { MostFrequentLocationCoords = new List<double> { 30.0, 40.0 } }
                },
                Maps = new MapLinksDto()
            };

            _mockPythonApiHandler.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = JsonContent.Create(pythonResponse)
                });

            // 2. Mock the response from the Geocoding Service
            _mockGeocodingService.Setup(s => s.GetLocationNameAsync(10.0, 20.0)).ReturnsAsync("Central Park");
            _mockGeocodingService.Setup(s => s.GetLocationNameAsync(30.0, 40.0)).ReturnsAsync("Times Square");

            // 3. Create a dummy request DTO
            var request = CreateDummyRequest();

            // --- ACT ---
            var result = await _service.AnalyzeProximityAsync(request);

            // --- ASSERT ---
            result.Should().NotBeNull();
            result.Insight.ConnectionScore.Should().Be(85);

            // Assert that the moment was enriched with the geocoded name
            result.MomentsOfConnection.Should().HaveCount(1);
            result.MomentsOfConnection[0].Location.Name.Should().Be("Central Park");

            // Assert that the summary was enriched with the geocoded name
            result.IndividualSummaries["person_a"].MostFrequentLocationName.Should().Be("Times Square");

            // Verify that the geocoding service was actually called with the correct coordinates
            _mockGeocodingService.Verify(s => s.GetLocationNameAsync(10.0, 20.0), Times.Once);
            _mockGeocodingService.Verify(s => s.GetLocationNameAsync(30.0, 40.0), Times.Once);
        }

        [Fact]
        public async Task AnalyzeProximityAsync_ShouldThrowHttpRequestException_WhenPythonApiReturnsError()
        {
            // --- ARRANGE ---
            _mockPythonApiHandler.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Content = new StringContent("Python service failed")
                });

            var request = CreateDummyRequest();

            // --- ACT & ASSERT ---
            Func<Task> act = () => _service.AnalyzeProximityAsync(request);
            await act.Should().ThrowAsync<HttpRequestException>()
                .WithMessage("Failed to analyze proximity due to an analytics server error.");
        }

        [Fact]
        public async Task AnalyzeProximityAsync_ShouldThrowInvalidOperationException_WhenPythonApiReturnsBadRequest()
        {
            // --- ARRANGE ---
            _mockPythonApiHandler.Protected()
               .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
               .ReturnsAsync(new HttpResponseMessage
               {
                   StatusCode = HttpStatusCode.BadRequest,
                   Content = new StringContent("Invalid input file.")
               });

            var request = CreateDummyRequest();

            // --- ACT & ASSERT ---
            Func<Task> act = () => _service.AnalyzeProximityAsync(request);
            await act.Should().ThrowAsync<InvalidOperationException>()
                .WithMessage("Analytics service rejected input: Invalid input file.");
        }

        // Helper method to create a valid request object to reduce code duplication
        private AnalyticsRequestDto CreateDummyRequest()
        {
            var mockFile = new FormFile(new MemoryStream(new byte[] { 1, 2, 3 }), 0, 3, "file", "test.json");
            return new AnalyticsRequestDto
            {
                PersonAFile = mockFile,
                PersonBFile = mockFile,
                NameA = "Alice",
                NameB = "Bob",
                Date = "2024-01-01"
            };
        }
    }
}