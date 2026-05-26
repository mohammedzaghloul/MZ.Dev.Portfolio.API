namespace Link.Dev.Profolie.BLL.Dto.ExperienceDto
{
    public class ExperienceDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Company { get; set; } = null!;
        public string DateRange { get; set; } = null!;
        public string? Description { get; set; }
        public string UserId { get; set; } = null!;
    }
}
