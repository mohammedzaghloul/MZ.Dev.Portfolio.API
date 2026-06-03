namespace Link.Dev.Profolie.BLL.Dto.ExperienceDto
{
    public class ExperienceDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Company { get; set; } = null!;
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string? Description { get; set; }
        public string UserId { get; set; } = null!;
    }
}
