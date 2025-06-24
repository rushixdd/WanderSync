using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace WanderSync.Application.DTOs
{
    public class AnalyticsRequestDto
    {
        [FromForm(Name = "person_a_file")]
        public IFormFile PersonAFile { get; set; } = default!;
        [FromForm(Name = "person_b_file")]
        public IFormFile PersonBFile { get; set; } = default!;
        [FromForm(Name = "name_a")]
        public string NameA { get; set; } = "Person A";
        [FromForm(Name = "name_b")]
        public string NameB { get; set; } = "Person B";
        [FromForm(Name = "date")]
        public string Date { get; set; } = string.Empty;
    }
}
