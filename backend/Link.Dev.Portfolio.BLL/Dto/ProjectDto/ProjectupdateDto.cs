using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Link.Dev.Profolie.BLL.Dto.ProjectDto
{
    public class ProjectUpdateDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? Link { get; set; }
        public string? Image { get; set; }
        public IFormFile? ImageFile { get; set; }
        public string? TechStack { get; set; }
        public string? GithubLink { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string UserId { get; set; } = null!;
    }
}
