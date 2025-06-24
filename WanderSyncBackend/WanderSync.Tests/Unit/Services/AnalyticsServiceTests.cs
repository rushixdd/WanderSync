using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using Moq.Protected;
using System.Net;
using System.Net.Http.Json;
using WanderSync.Application.DTOs;
using WanderSync.Infrastructure.Services;

namespace WanderSync.Tests.Unit.Services
{
    public class AnalyticsServiceTests
    {
        [Fact]
        public async Task AnalyzeProximityAsync_ShouldReturnExpectedResponse_WhenApiReturnsSuccess()
        {
            // Arrange
            var mockResponse = new AnalyticsResponseDto
            {
                Insight = new InsightDto { Score = 95 },
                Encounters = new List<EncounterDto> {
                                new EncounterDto {
                                    DistanceM = 10,
                                    PersonATime = "2024-01-01T12:00:00Z",
                                    PersonBTime = "2024-01-01T12:01:00Z"
                                }
                            },
                Summary = new SummaryGroupDto()
            };

            var handler = new Mock<HttpMessageHandler>();
            handler.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = JsonContent.Create(mockResponse)
                });

            var httpClient = new HttpClient(handler.Object)
            {
                BaseAddress = new Uri("http://localhost")
            };

            var service = new AnalyticsService(httpClient);

            var mockFile = new FormFile(new MemoryStream(new byte[] { 1, 2, 3 }), 0, 3, "file", "test.json");

            var request = new AnalyticsRequestDto
            {
                PersonAFile = mockFile,
                PersonBFile = mockFile,
                NameA = "Alice",
                NameB = "Bob",
                Date = "2024-01-01"
            };

            // Act
            var result = await service.AnalyzeProximityAsync(request);

            // Assert
            result.Should().NotBeNull();
            result.Insight.Score.Should().Be(95);
            result.Encounters.Should().HaveCount(1);
        }

        [Fact]
        public async Task AnalyzeProximityAsync_ShouldThrow_WhenApiReturnsError()
        {
            // Arrange
            var handlerMock = new Mock<HttpMessageHandler>();
            handlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Content = new StringContent("Server error"),
                });

            var httpClient = new HttpClient(handlerMock.Object)
            {
                BaseAddress = new Uri("http://localhost")
            };

            var service = new AnalyticsService(httpClient);

            var dummyStream = new MemoryStream(new byte[] { 1, 2, 3 });
            var dummyFileA = new Mock<IFormFile>();
            dummyFileA.Setup(f => f.OpenReadStream()).Returns(dummyStream);
            dummyFileA.Setup(f => f.FileName).Returns("a.json");

            var dummyFileB = new Mock<IFormFile>();
            dummyFileB.Setup(f => f.OpenReadStream()).Returns(dummyStream);
            dummyFileB.Setup(f => f.FileName).Returns("b.json");

            var request = new AnalyticsRequestDto
            {
                PersonAFile = dummyFileA.Object,
                PersonBFile = dummyFileB.Object,
                NameA = "Alice",
                NameB = "Bob",
                Date = "2024-07-27"
            };

            await Assert.ThrowsAsync<HttpRequestException>(() => service.AnalyzeProximityAsync(request));
        }
    }
}
