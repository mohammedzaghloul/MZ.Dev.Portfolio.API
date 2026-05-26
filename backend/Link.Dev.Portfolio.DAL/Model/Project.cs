using System.ComponentModel.DataAnnotations.Schema;

namespace Link.Dev.Profolie.DAL.Model
{
    public class Project : ModelBase
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? Image { get; set; }
        public string? Link { get; set; }
        public string? TechStack { get; set; }
        public string? GithubLink { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        
        // FK
        [ForeignKey("ApplicationUser")]
        public string UserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
    }
}
