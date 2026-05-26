namespace Link.Dev.Profolie.BLL.Dto.ContactDto
{
    public class UpdateContactDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string? Github { get; set; }
        public string? Linkedin { get; set; }
        public string? Facebook { get; set; }
        public string? Instagram { get; set; }
        public string? TikTok { get; set; }
        public string UserId { get; set; } = null!;
    }
}
