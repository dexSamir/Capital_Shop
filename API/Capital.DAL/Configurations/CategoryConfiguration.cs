using Capital.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Capital.DAL.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.HasKey(c => c.Id);


        builder.Property(c => c.Title)
            .HasColumnType("varchar(100)")
            .IsRequired();

        builder.Property(c => c.ImageUrl)
            .HasColumnType("varchar(255)")
            .IsRequired();

        builder.Property(c => c.CreatedTime)
            .HasColumnType("timestamp with time zone")
            .IsRequired();

        builder.Property(c => c.UpdatedTime)
            .IsRequired(false)
            .HasColumnType("timestamp with time zone");

        builder.Property(c => c.isDeleted)
            .HasDefaultValue(false);

        builder.Property(c => c.isUpdated)
            .HasDefaultValue(false);

        builder.HasMany(c => c.Products)
            .WithOne()
            .HasForeignKey(p => p.CategoryId) 
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasIndex(c => c.Title)
            .IsUnique();

        builder.HasIndex(c => c.isDeleted); 
        builder.HasIndex(c => c.isUpdated);
        builder.HasIndex(c => c.CreatedTime);
    }
}