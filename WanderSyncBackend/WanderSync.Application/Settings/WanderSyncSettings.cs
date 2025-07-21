namespace WanderSync.Application.Settings
{
    public class WanderSyncSettings
    {
        public const string SectionName = "WanderSyncSettings";
        public string AnalyticsServiceUrl { get; set; } = string.Empty;
        public string AnalyticsServiceApiKey { get; set; } = string.Empty;
    }
}