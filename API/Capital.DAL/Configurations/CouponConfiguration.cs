using Capital.Core.Entities;
using Capital.Core.Helper.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Capital.DAL.Configurations; 
public class DiscountConfiguration : IEntityTypeConfiguration<Coupon>
{
    public void Configure(EntityTypeBuilder<Coupon> builder)
    {
        builder.HasKey(d => d.Id);


        builder.Property(d => d.CreatedTime)
            .HasColumnType("timestamp with time zone")
            .IsRequired();

        builder.Property(d => d.UpdatedTime)
            .HasColumnType("timestamp with time zone")
            .IsRequired(false);

        builder.Property(d => d.isDeleted)
            .HasDefaultValue(false);

        builder.Property(d => d.isUpdated)
            .HasDefaultValue(false);

        builder.Property(d => d.Title)
            .HasColumnType("varchar(100)")
            .IsRequired();

        builder.Property(d => d.Description)
            .HasColumnType("text")
            .HasMaxLength(1000)
            .IsRequired(false);

        builder.Property(d => d.DiscountType)
            .HasColumnType("varchar(20)")
            .HasConversion(
                v => v.ToString(),
                v => (EDiscountType)Enum.Parse(typeof(EDiscountType), v))
            .IsRequired();

        builder.Property(d => d.EndTime)
            .HasColumnType("timestamp with time zone")
            .IsRequired();

        builder.Property(d => d.CouponCode)
            .HasColumnType("varchar(50)")
            .IsRequired();

        builder.Property(d => d.UsageLimit)
            .IsRequired(false);

        builder.Property(d => d.UsageCount)
            .HasDefaultValue(0)
            .IsRequired(false);

        builder.Property(d => d.IsActive)
            .HasDefaultValue(true);

        builder.Property(d => d.DiscountValue)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(d => d.MinimumOrderAmount)
            .HasColumnName("minimum_order_amount")
            .IsRequired(false);

        builder.HasMany(d => d.Products)
            .WithOne(d => d.Coupon)
            .HasForeignKey(d => d.CouponId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(d => d.CouponCode)
            .IsUnique();
        builder.HasIndex(d => d.IsActive);
        builder.HasIndex(d => d.EndTime);
        builder.HasIndex(d => d.isDeleted);
        builder.HasIndex(d => d.CreatedTime);
        builder.HasIndex(d => d.DiscountValue);
        builder.HasIndex(d => d.UsageCount);
        builder.HasIndex(d => d.UsageLimit);
    }
}

