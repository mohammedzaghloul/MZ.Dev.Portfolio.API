using Link.Dev.Profolie.DAL.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Link.Dev.Profolie.DAL.Data.Configuration.ProjectSkillConfg
{
    public class ProjectSkillConfiguration : IEntityTypeConfiguration<ProjectSkill>
    {
        public void Configure(EntityTypeBuilder<ProjectSkill> builder)
        {
            builder.HasKey(ps => ps.Id);

            builder.HasIndex(ps => new { ps.ProjectId, ps.SkillId })
                .IsUnique();

            builder.HasOne(ps => ps.Project)
                .WithMany()
                .HasForeignKey(ps => ps.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(ps => ps.Skill)
                .WithMany()
                .HasForeignKey(ps => ps.SkillId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
