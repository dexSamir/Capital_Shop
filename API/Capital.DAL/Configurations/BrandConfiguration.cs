using Capital.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Capital.DAL.Configurations;

public class BrandConfiguration : IEntityTypeConfiguration<Brand>
{
    public void Configure(EntityTypeBuilder<Brand> builder)
    {
        builder.HasKey(b => b.Id);

        builder.Property(b => b.Id)
            .HasDefaultValueSql("gen_random_uuid()");

        builder.Property(b => b.CreatedTime)
            .HasColumnType("timestamp with time zone")
            .IsRequired();

        builder.Property(b => b.UpdatedTime)
            .HasColumnType("timestamp with time zone")
            .IsRequired(false);

        builder.Property(b => b.isDeleted)
            .HasDefaultValue(false);

        builder.Property(b => b.isUpdated)
            .HasDefaultValue(false);

        builder.Property(b => b.Title)
            .HasColumnType("varchar(100)")
            .IsRequired();

        builder.Property(b => b.LogoUrl)
            .HasColumnType("varchar(255)")
            .IsRequired(false);

        builder.Property(b => b.Website)
            .HasColumnType("varchar(255)")
            .IsRequired(false);

        builder.HasMany(b => b.Products)
            .WithOne(p => p.Brand) 
            .HasForeignKey(p => p.BrandId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(b => b.Title)
            .IsUnique();

        builder.HasIndex(b => b.isDeleted);
        builder.HasIndex(b => b.CreatedTime);
        builder.HasIndex(b => b.isUpdated);
        builder.HasIndex(b => b.Title);
    }
}

