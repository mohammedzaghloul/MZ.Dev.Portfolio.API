using System.ComponentModel.DataAnnotations;

namespace Link.Dev.Profolie.BLL.Dto.ExperienceDto
{
    public class CreateExperienceDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = null!;

        [Required]
        [MaxLength(200)]
        public string Company { get; set; } = null!;

        [Required]
        public DateOnly StartDate { get; set; }

        public DateOnly? EndDate { get; set; }

        [MaxLength(2000)]
        public string? Description { get; set; }

        [Required]
        public string UserId { get; set; } = null!;
    }
}
