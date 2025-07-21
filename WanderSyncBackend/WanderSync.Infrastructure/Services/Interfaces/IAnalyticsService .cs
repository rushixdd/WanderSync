using WanderSync.Application.DTOs;

namespace WanderSync.Infrastructure.Services.Interfaces
{
    public interface IAnalyticsService
    {
        Task<AnalyticsResponseDto> AnalyzeProximityAsync(AnalyticsRequestDto request);
    }
}
