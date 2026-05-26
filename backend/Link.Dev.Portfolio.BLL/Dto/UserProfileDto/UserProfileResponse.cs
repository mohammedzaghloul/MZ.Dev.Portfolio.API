namespace Link.Dev.Profolie.BLL.Dto.UserProfileDto
{
    public class UserProfileResponse
    {
        public string Id { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Title { get; set; }
        public string? About { get; set; }
        public string? Image { get; set; }
        public bool IsActive { get; set; }
        public string Template { get; set; } = "1";
    }
}
