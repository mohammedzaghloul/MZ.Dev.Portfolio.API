using Link.Dev.Profolie.DAL.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Link.Dev.Profolie.DAL.Data.Configuration.ExperienceConfg
{
    public class ExperienceConfiguration : IEntityTypeConfiguration<Experience>
    {
        public void Configure(EntityTypeBuilder<Experience> builder)
        {
            builder.HasKey(e => e.Id);

            builder.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(e => e.Company)
                .IsRequired()
                .HasMaxLength(200);

   

            builder.Property(e => e.Description)
                .HasMaxLength(2000);

            builder.Property(e => e.UserId)
                .IsRequired()
                .HasMaxLength(450);

            builder.HasOne(e => e.User)
                .WithMany(u => u.Experiences)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
