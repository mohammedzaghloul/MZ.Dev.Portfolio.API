using Link.Dev.Profolie.DAL.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Link.Dev.Profolie.DAL.Data.Configuration.ContactConfg
{
    public class ContactConfiguration : IEntityTypeConfiguration<Contact>
    {
        public void Configure(EntityTypeBuilder<Contact> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Email)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(c => c.Github)
                .HasMaxLength(500);

            builder.Property(c => c.Linkedin)
                .HasMaxLength(500);

            builder.Property(c => c.Facebook)
                .HasMaxLength(500);

            builder.Property(c => c.Instagram)
                .HasMaxLength(500);

            builder.Property(c => c.TikTok)
                .HasMaxLength(500);

            builder.Property(c => c.UserId)
                .IsRequired()
                .HasMaxLength(450);

            builder.HasOne(c => c.User)
                .WithOne(u => u.Contact)
                .HasForeignKey<Contact>(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
