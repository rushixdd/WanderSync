using System.Text.Json.Serialization;

namespace WanderSync.Application.DTOs
{
    public class InsightDto
    {
        [JsonPropertyName("connection_score")]
        public double ConnectionScore { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("narrative")]
        public string Narrative { get; set; } = string.Empty;
    }
}