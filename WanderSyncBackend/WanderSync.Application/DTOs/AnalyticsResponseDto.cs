namespace WanderSync.Application.DTOs
{
    public class AnalyticsResponseDto
    {
        public SummaryGroupDto Summary { get; set; } = default!;
        public List<EncounterDto> Encounters { get; set; } = new();
        public InsightDto Insight { get; set; } = default!;
        public MapLinksDto Maps { get; set; } = default!;
    }
}
