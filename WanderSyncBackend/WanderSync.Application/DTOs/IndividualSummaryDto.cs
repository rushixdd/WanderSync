using System.Text.Json.Serialization;

namespace WanderSync.Application.DTOs
{
    public class IndividualSummaryDto
    {
        // --- Data from Python Service ---
        [JsonPropertyName("total_distance_km")]
        public double TotalDistanceKm { get; set; }

        [JsonPropertyName("time_moving_minutes")]
        public int TimeMovingMinutes { get; set; }

        [JsonPropertyName("average_speed_kmh")]
        public double AverageSpeedKmh { get; set; }

        [JsonPropertyName("most_frequent_location_coords")]
        public List<double>? MostFrequentLocationCoords { get; set; }

        // --- Enriched Data (added in C#) ---
        [JsonPropertyName("most_frequent_location_name")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? MostFrequentLocationName { get; set; }
    }
}