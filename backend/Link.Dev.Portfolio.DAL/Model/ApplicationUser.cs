using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Link.Dev.Profolie.DAL.Model
{
    public class ApplicationUser : IdentityUser
    {
        
        public string? Title { get; set; }
        public string? About { get; set; }
        public bool IsActive { get; set; }
        public string? Image { get; set; }
        public string Template { get; set; } = "1"; // 1=Nebula, 2=Ocean, 3=Minimal
        // Relations
        public virtual ICollection<Skill>? Skills { get; set; }
        public virtual ICollection<Project>? Projects { get; set; }
        public virtual ICollection<Experience>? Experiences { get; set; }

        public virtual Contact? Contact { get; set; }


    }
}
