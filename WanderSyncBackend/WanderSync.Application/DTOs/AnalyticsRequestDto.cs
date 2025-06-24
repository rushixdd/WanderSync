using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace WanderSync.Application.DTOs
{
    public class AnalyticsRequestDto
    {
        public IFormFile PersonAFile { get; set; } = default!;
        public IFormFile PersonBFile { get; set; } = default!;
        public string NameA { get; set; } = "Person A";
        public string NameB { get; set; } = "Person B";
        public string Date { get; set; } = string.Empty;
    }
}
