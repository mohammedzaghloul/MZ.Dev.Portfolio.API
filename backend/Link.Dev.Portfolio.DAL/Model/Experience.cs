using System.ComponentModel.DataAnnotations.Schema;

namespace Link.Dev.Profolie.DAL.Model
{
    public class Experience : ModelBase
    {
        public string Title { get; set; } = null!;
        public string Company { get; set; } = null!;
        public string StartDate { get; set; } = null!;
        public string? EndDate { get; set; }
        public string? Description { get; set; }

        // FK
        [ForeignKey("ApplicationUser")]
        public string UserId { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
    }
}
