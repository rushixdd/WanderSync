using System.Text.Json.Serialization;

namespace WanderSync.Application.DTOs
{
    public class MapLinksDto
    {
        [JsonPropertyName("shared_map")]
        public string SharedMap { get; set; } = string.Empty;

        [JsonPropertyName("animated_map")]
        public string AnimatedMap { get; set; } = string.Empty;

    }
}
