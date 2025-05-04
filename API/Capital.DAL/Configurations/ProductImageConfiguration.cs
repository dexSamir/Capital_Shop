using Capital.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Capital.DAL.Configurations;

public class ProductImageConfiguration : IEntityTypeConfiguration<ProductImage>
{
    public void Configure(EntityTypeBuilder<ProductImage> builder)
    {
        builder.HasKey(pi => pi.Id);

        builder.Property(pi => pi.Id)
            .HasDefaultValueSql("gen_random_uuid()"); 

        builder.Property(pi => pi.ImageUrl)
            .HasColumnType("varchar(500)")
            .HasMaxLength(500)
            .IsRequired(false); 

        builder.Property(pi => pi.IsPrimary)
            .HasDefaultValue(false);

        builder.Property(pi => pi.AltText)
            .HasColumnType("varchar(150)")
            .IsRequired(false); 

        builder.Property(pi => pi.ProductId)
            .IsRequired();

        builder.Property(pi => pi.ReviewId)
            .IsRequired(false); 

        builder.HasOne(pi => pi.Product)
            .WithMany(p => p.Images) 
            .HasForeignKey(pi => pi.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(pi => pi.Review)
            .WithMany(r => r.Images) 
            .HasForeignKey(pi => pi.ReviewId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Property(pi => pi.CreatedTime)
            .HasColumnType("timestamp with time zone")
            .IsRequired();

        builder.Property(pi => pi.UpdatedTime)
            .HasColumnType("timestamp with time zone")
            .IsRequired(false);

        builder.Property(pi => pi.isDeleted)
            .HasDefaultValue(false);

        builder.Property(pi => pi.isUpdated)
            .HasDefaultValue(false);

        builder.HasIndex(pi => pi.ProductId);
        builder.HasIndex(pi => pi.ReviewId);
        builder.HasIndex(pi => pi.IsPrimary);
        builder.HasIndex(pi => pi.isDeleted); 
        builder.HasIndex(pi => pi.isUpdated);
        builder.HasIndex(pi => pi.CreatedTime);
    }
}

