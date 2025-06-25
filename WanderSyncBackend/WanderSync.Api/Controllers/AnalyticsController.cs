using Microsoft.AspNetCore.Mvc;
using WanderSync.Application.DTOs;
using WanderSync.Infrastructure.Services.Interfaces;

namespace WanderSync.Api.Controllers
{
    [RequestSizeLimit(104857600)]
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;

        public AnalyticsController(IAnalyticsService analyticsService)
        {
            _analyticsService = analyticsService;
        }

        [HttpPost("proximity")]
        public async Task<IActionResult> AnalyzeProximity([FromForm] AnalyticsRequestDto request)
        {
            if (request.PersonAFile == null || request.PersonBFile == null)
            {
                return BadRequest("Both person_a_file and person_b_file must be provided.");
            }

            try
            {
                var result = await _analyticsService.AnalyzeProximityAsync(request);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(502, $"Error communicating with Analytics service: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Unexpected error: {ex.Message}");
            }
        }
    }
}
