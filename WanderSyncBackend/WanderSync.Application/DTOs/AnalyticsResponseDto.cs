using System.Text.Json.Serialization;

namespace WanderSync.Application.DTOs
{
    public class AnalyticsResponseDto
    {
        [JsonPropertyName("insight")]
        public InsightDto Insight { get; set; } = default!;

        [JsonPropertyName("individual_summaries")]
        public Dictionary<string, IndividualSummaryDto> IndividualSummaries { get; set; } = new();

        [JsonPropertyName("moments_of_connection")]
        public List<MomentDto> MomentsOfConnection { get; set; } = new();

        [JsonPropertyName("maps")]
        public MapLinksDto Maps { get; set; } = default!;
    }
}