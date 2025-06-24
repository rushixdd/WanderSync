using System.Text.Json.Serialization;

namespace WanderSync.Application.DTOs
{
    public class EncounterDto
    {
        [JsonPropertyName("person_a_time")]
        public string PersonATime { get; set; } = string.Empty;

        [JsonPropertyName("person_b_time")]
        public string PersonBTime { get; set; } = string.Empty;

        [JsonPropertyName("distance_m")]
        public double DistanceM { get; set; }

    }
}
