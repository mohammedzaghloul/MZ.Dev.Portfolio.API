using Microsoft.AspNetCore.Http;

namespace Link.Dev.Profolie.BLL.Dto.UserProfileDto
{
    public class UpdateUserProfileDto
    {
        public string? UserName { get; set; }
        public string? Title { get; set; }
        public string? About { get; set; }
        public string? Template { get; set; }
        public bool? IsActive { get; set; }
        public bool RemoveImage { get; set; }
        public bool RemoveResume { get; set; }
        public IFormFile? ImageFile { get; set; }
        public IFormFile? ResumeFile { get; set; }
    }
}
