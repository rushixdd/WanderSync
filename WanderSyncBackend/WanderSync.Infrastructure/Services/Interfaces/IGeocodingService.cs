namespace WanderSync.Infrastructure.Services.Interfaces
{
    public interface IGeocodingService
    {
        Task<string> GetLocationNameAsync(double latitude, double longitude);
    }
}
