using System.Text.Json.Serialization;

namespace WanderSync.Application.DTOs
{
    public class InsightDto
    {
        [JsonPropertyName("score")]
        public double Score { get; set; }

        [JsonPropertyName("details")]
        public InsightDetailsDto Details { get; set; } = default!;

        [JsonPropertyName("summary")]
        public string Summary { get; set; } = string.Empty;

    }

    public class InsightDetailsDto
    {
        [JsonPropertyName("avg_distance_m")]
        public double AvgDistanceM { get; set; }

        [JsonPropertyName("avg_time_difference_sec")]
        public double AvgTimeDifferenceSec { get; set; }

        [JsonPropertyName("encounter_count")]
        public int EncounterCount { get; set; }

    }
}
