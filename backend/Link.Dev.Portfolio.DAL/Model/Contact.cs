namespace Link.Dev.Profolie.DAL.Model
{
    public class Contact:ModelBase
    {

        public string? Email { get; set; }
        public string? Github { get; set; }
        public string? Linkedin { get; set; }
        public string? Facebook { get; set; }
        public string? Instagram { get; set; }

        public string? TikTok { get; set; }


        // FK
        public string UserId { get; set; } = null!;
        public virtual  ApplicationUser User { get; set; }=null!;
    }
}
