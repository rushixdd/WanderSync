using WanderSync.Api.Middleware;
using WanderSync.Infrastructure.Services;
using WanderSync.Infrastructure.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient<IAnalyticsService, AnalyticsService>(client =>
{
    client.BaseAddress = new Uri("http://localhost:8000"); // Adjust to actual service URL
    client.DefaultRequestHeaders.Add("X-API-Key", "your-very-secret-key");
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();
app.UseMiddleware<ErrorHandlingMiddleware>();
app.Run();

public partial class Program
{
    // This partial class is used to allow for additional configurations or methods in other files.
}