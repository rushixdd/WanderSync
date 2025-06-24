namespace WanderSync.Application.DTOs
{
    public class SummaryGroupDto
    {
        public SummaryDto PersonA { get; set; } = default!;
        public SummaryDto PersonB { get; set; } = default!;
    }

    public class SummaryDto
    {
        public double TotalDistanceKm { get; set; }
        public int NumberOfPoints { get; set; }
        public string StartTime { get; set; } = string.Empty;
        public string EndTime { get; set; } = string.Empty;
    }
}
