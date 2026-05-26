using Link.Dev.Profolie.DAL.Data.Configuration.ContactConfg;
using Link.Dev.Profolie.DAL.Data.Configuration.ProjectConfg;
using Link.Dev.Profolie.DAL.Data.Configuration.ProjectSkillConfg;
using Link.Dev.Profolie.DAL.Data.Configuration.SkillConfg;
using Link.Dev.Profolie.DAL.Data.Configuration.UserConfg;
using Link.Dev.Profolie.DAL.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Link.Dev.Profolie.DAL.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
        {
        }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> dbContext) : base(dbContext)
        { }

        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectSkill> ProjectSkills { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<Experience> Experiences { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Apply all configurations
            builder.ApplyConfiguration(new ContactConfiguration());
            builder.ApplyConfiguration(new ProjectConfiguration());
            builder.ApplyConfiguration(new SkillConfiguration());
            builder.ApplyConfiguration(new ProjectSkillConfiguration());
            builder.ApplyConfiguration(new ApplicationUserConfiguration());
            builder.ApplyConfiguration(new Link.Dev.Profolie.DAL.Data.Configuration.ExperienceConfg.ExperienceConfiguration());
        }
    }
}

