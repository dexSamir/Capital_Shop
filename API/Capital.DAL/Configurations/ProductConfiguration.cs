using Capital.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Capital.DAL.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.CreatedTime)
            .HasColumnType("timestamp with time zone")
            .IsRequired();

        builder.Property(p => p.UpdatedTime)
            .HasColumnType("timestamp with time zone")
            .IsRequired(false);

        builder.Property(p => p.isDeleted)
            .HasDefaultValue(false);

        builder.Property(p => p.isUpdated)
            .HasDefaultValue(false);

        builder.Property(p => p.SellPrice)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(p => p.CostPrice)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(p => p.Discount)
            .IsRequired();

        builder.Property(p => p.AvgRating)
            .HasDefaultValue(0);

        builder.Property(p => p.Quantity)
            .IsRequired();

        builder.Property(p => p.SKU)
            .HasColumnType("varchar(100)")
            .IsRequired();

        builder.HasIndex(p => p.SKU)
            .IsUnique();

        builder.Property(p => p.Title)
            .HasColumnType("varchar(200)")
            .IsRequired();

        builder.Property(p => p.Description)
            .HasColumnType("text")
            .IsRequired();

        builder.Property(p => p.CoverImage)
            .HasColumnType("varchar(255)")
            .IsRequired();

        builder.Property(p => p.SecondImage)
            .HasColumnType("varchar(255)")
            .IsRequired(false);

        builder.Property(p => p.Weight)
            .HasColumnType("decimal(10,2)");

        builder.Property(p => p.Length)
            .HasColumnType("decimal(10,2)");

        builder.Property(p => p.Width)
            .HasColumnType("decimal(10,2)");

        builder.Property(p => p.Height)
            .HasColumnType("decimal(10,2)");

        builder.HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.Brand)
            .WithMany(b => b.Products)
            .HasForeignKey(p => p.BrandId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(p => p.Coupon)
            .WithMany()
            .HasForeignKey(p => p.CouponId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(p => p.Images)
            .WithOne(i => i.Product)
            .HasForeignKey(i => i.ProductId);

        builder.HasMany(p => p.Reviews)
            .WithOne(r => r.Product)
            .HasForeignKey(r => r.ProductId);

        builder.HasMany(p => p.Ratings)
            .WithOne(r => r.Product)
            .HasForeignKey(r => r.ProductId);

        builder.HasMany(p => p.ProductAttributeValues)
            .WithOne(a => a.Product)
            .HasForeignKey(a => a.ProductId);

        builder.HasMany(p => p.Specifications)
            .WithOne(s => s.Product)
            .HasForeignKey(s => s.ProductId);

        builder.HasIndex(p => p.isDeleted);
        builder.HasIndex(p => p.CreatedTime);
        builder.HasIndex(p => p.IsBestseller);
        builder.HasIndex(p => p.IsNewArrival);
        builder.HasIndex(p => p.CategoryId);
    }
}