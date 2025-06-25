using System.Text.Json.Serialization;

namespace WanderSync.Application.DTOs
{
    public class AnalyticsResponseDto
    {
        [JsonPropertyName("summary")]
        public SummaryGroupDto Summary { get; set; } = default!;

        [JsonPropertyName("encounters")]
        public List<EncounterDto> Encounters { get; set; } = new();

        [JsonPropertyName("insight")]
        public InsightDto Insight { get; set; } = default!;

        [JsonPropertyName("maps")]
        public MapLinksDto Maps { get; set; } = default!;
    }
}
