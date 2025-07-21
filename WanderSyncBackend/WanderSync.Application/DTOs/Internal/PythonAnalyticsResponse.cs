using System.Text.Json.Serialization;

namespace WanderSync.Application.DTOs.Internal
{
    public class PythonAnalyticsResponse
    {
        [JsonPropertyName("individual_summaries")]
        public Dictionary<string, IndividualSummaryDto> IndividualSummaries { get; set; } = new();

        [JsonPropertyName("clustered_moments")]
        public List<MomentDto> ClusteredMoments { get; set; } = new();

        [JsonPropertyName("insight")]
        public InsightDto Insight { get; set; } = new();

        [JsonPropertyName("maps")]
        public MapLinksDto Maps { get; set; } = new();
    }
}