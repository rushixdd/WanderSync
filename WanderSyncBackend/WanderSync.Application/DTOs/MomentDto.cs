using System.Text.Json.Serialization;

namespace WanderSync.Application.DTOs
{
    public class MomentDto
    {
        // --- Data from Python Service ---
        [JsonPropertyName("location_coords")]
        public List<double> LocationCoords { get; set; } = new();

        [JsonPropertyName("start_time_utc")]
        public string StartTimeUtc { get; set; } = string.Empty;

        [JsonPropertyName("end_time_utc")]
        public string EndTimeUtc { get; set; } = string.Empty;

        [JsonPropertyName("duration_seconds")]
        public double DurationSeconds { get; set; }

        [JsonPropertyName("average_distance_meters")]
        public double AverageDistanceMeters { get; set; }

        [JsonPropertyName("min_distance_meters")]
        public double MinDistanceMeters { get; set; }

        // --- Enriched Data (added in C#) ---
        [JsonPropertyName("location")]
        public LocationDetailsDto Location { get; set; } = new();
    }

    public class LocationDetailsDto
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = "Unknown Location";

        [JsonPropertyName("hint")]
        public string? Hint { get; set; }

        [JsonPropertyName("icon_emoji")]
        public string? IconEmoji { get; set; }
    }
}