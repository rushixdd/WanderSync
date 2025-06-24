using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using WanderSync.Api;

namespace WanderSync.Tests.Integration
{
    public class CustomWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");

            builder.ConfigureServices(services =>
            {
                // Optional: remove and replace services here
                // Example for replacing IAnalyticsService with a mock:
                // services.RemoveAll<IAnalyticsService>();
                // services.AddScoped<IAnalyticsService, MockAnalyticsService>();
            });
        }
    }
}
