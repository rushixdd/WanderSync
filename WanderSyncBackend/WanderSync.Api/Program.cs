using WanderSync.Api.Middleware;
using WanderSync.Application.Settings;
using WanderSync.Infrastructure.Services;
using WanderSync.Infrastructure.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var wanderSyncSettings = builder.Configuration.GetSection(WanderSyncSettings.SectionName).Get<WanderSyncSettings>();
builder.Services.AddHttpClient<IAnalyticsService, AnalyticsService>(client =>
{
    client.BaseAddress = new Uri(wanderSyncSettings.AnalyticsServiceUrl); // Adjust to actual service URL
    client.DefaultRequestHeaders.Add("X-API-Key", wanderSyncSettings.AnalyticsServiceApiKey);
});
builder.Services.AddHttpClient<IGeocodingService, NominatimService>();

builder.Logging.ClearProviders(); // Optional: clears default providers
builder.Logging.AddConsole();     // Adds console logger

// Optional: set log level
builder.Logging.SetMinimumLevel(LogLevel.Information);

// CORS setup
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors();
app.UseMiddleware<ErrorHandlingMiddleware>();
app.MapControllers();
app.Run();

public partial class Program
{
    // This partial class is used to allow for additional configurations or methods in other files.
}