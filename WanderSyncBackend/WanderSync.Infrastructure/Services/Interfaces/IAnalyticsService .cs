using System.Net.Http;
using System.Threading.Tasks;
using WanderSync.Application.DTOs;

namespace WanderSync.Infrastructure.Services.Interfaces
{
    public interface IAnalyticsService
    {
        Task<AnalyticsResponseDto> AnalyzeProximityAsync(AnalyticsRequestDto request);
    }
}
