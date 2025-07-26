using Capital.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Capital.DAL.Configurations;

public class ProductAttributeConfiguration : IEntityTypeConfiguration<ProductAttribute>
{
    public void Configure(EntityTypeBuilder<ProductAttribute> builder)
    {
        builder.HasKey(pa => pa.Id);

        builder.Property(pa => pa.CreatedTime)
            .HasColumnType("timestamp with time zone")
            .IsRequired();

        builder.Property(pa => pa.UpdatedTime)
            .HasColumnType("timestamp with time zone")
            .IsRequired(false);

        builder.Property(pa => pa.isDeleted)
            .HasDefaultValue(false)
            .IsRequired();

        builder.Property(pa => pa.isUpdated)
            .HasDefaultValue(false)
            .IsRequired();

        builder.Property(pa => pa.Name)
            .HasColumnName("name")
            .HasColumnType("varchar(100)")
            .IsRequired();

        builder.Property(pa => pa.Value)
            .HasColumnType("text")
            .IsRequired();

        builder.Property(pa => pa.ProductId)
            .HasColumnName("product_id")
            .IsRequired();

        builder.HasOne(pa => pa.Product)
            .WithMany(p => p.Attributes)
            .HasForeignKey(pa => pa.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(pa => pa.ProductId);

        builder.HasIndex(pa => new { pa.ProductId, pa.Name })
            .IsUnique();

        builder.HasIndex(pa => pa.Name);
        builder.HasIndex(pa => pa.isDeleted);
        builder.HasIndex(pa => pa.ProductId);
        builder.HasIndex(pa => pa.Value);
        builder.HasIndex(pa => pa.isUpdated);
        builder.HasIndex(pa => pa.isUpdated);
    }
}

