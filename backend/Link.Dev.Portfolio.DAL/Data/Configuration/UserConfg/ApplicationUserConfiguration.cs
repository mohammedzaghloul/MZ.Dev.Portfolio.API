using Link.Dev.Profolie.DAL.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Link.Dev.Profolie.DAL.Data.Configuration.UserConfg
{
    public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
    {
        public void Configure(EntityTypeBuilder<ApplicationUser> builder)
        {
            builder.Property(u => u.Title)
                .HasMaxLength(200);

            builder.Property(u => u.About)
                .HasMaxLength(2000);

            builder.Property(u => u.IsActive)
                .HasDefaultValue(true);

            // Configure Contact relationship (1-to-1)
            builder.HasOne(u => u.Contact)
                .WithOne(c => c.User)
                .HasForeignKey<Contact>(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
