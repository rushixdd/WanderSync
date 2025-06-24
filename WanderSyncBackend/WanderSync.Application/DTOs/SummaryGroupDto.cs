using System.Text.Json.Serialization;

namespace WanderSync.Application.DTOs
{
    public class SummaryGroupDto
    {
        [JsonPropertyName("person_a")]
        public SummaryDto? PersonA { get; set; } = default!;

        [JsonPropertyName("person_b")]
        public SummaryDto? PersonB { get; set; } = default!;

    }

    public class SummaryDto
    {
        [JsonPropertyName("total_distance_km")]
        public double TotalDistanceKm { get; set; }

        [JsonPropertyName("number_of_points")]
        public int NumberOfPoints { get; set; }

        [JsonPropertyName("start_time")]
        public string StartTime { get; set; } = string.Empty;

        [JsonPropertyName("end_time")]
        public string EndTime { get; set; } = string.Empty;
    }
}
