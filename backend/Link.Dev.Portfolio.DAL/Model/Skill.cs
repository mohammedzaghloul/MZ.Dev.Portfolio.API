using System.ComponentModel.DataAnnotations.Schema;

namespace Link.Dev.Profolie.DAL.Model
{
    public class Skill : ModelBase
    {
        public string? Name { get; set; }

        // FK
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
    }
}