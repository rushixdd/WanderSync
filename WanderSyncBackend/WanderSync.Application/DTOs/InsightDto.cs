namespace WanderSync.Application.DTOs
{
    public class InsightDto
    {
        public double Score { get; set; }
        public InsightDetailsDto Details { get; set; } = default!;
        public string Summary { get; set; } = string.Empty;
    }

    public class InsightDetailsDto
    {
        public double AvgDistanceM { get; set; }
        public double AvgTimeDifferenceSec { get; set; }
        public int EncounterCount { get; set; }
    }
}
