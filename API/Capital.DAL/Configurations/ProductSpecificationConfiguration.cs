using Capital.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Capital.DAL.Configurations; 

public class ProductSpecificationConfiguration : IEntityTypeConfiguration<ProductSpecification>
{
    public void Configure(EntityTypeBuilder<ProductSpecification> builder)
    {
        builder.HasKey(ps => ps.Id);

        builder.Property(ps => ps.Id)
            .HasDefaultValueSql("gen_random_uuid()")
            .ValueGeneratedOnAdd();

        builder.Property(ps => ps.CreatedTime)
            .HasColumnType("timestamptz")
            .IsRequired();

        builder.Property(ps => ps.UpdatedTime)
            .HasColumnType("timestamptz")
            .IsRequired(false);

        builder.Property(ps => ps.isDeleted)
            .HasDefaultValue(false)
            .IsRequired();

        builder.Property(ps => ps.isUpdated)
            .HasDefaultValue(false)
            .IsRequired();

        builder.Property(ps => ps.Key)
            .HasColumnType("varchar(100)")
            .IsRequired();

        builder.Property(ps => ps.Value)
            .HasColumnType("text") 
            .IsRequired();

        builder.Property(ps => ps.ProductId)
            .IsRequired();

        builder.HasOne(ps => ps.Product)
            .WithMany(p => p.Specifications) 
            .HasForeignKey(ps => ps.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(ps => ps.ProductId);

        builder.HasIndex(ps => new { ps.ProductId, ps.Key })
            .IsUnique();

        builder.HasIndex(ps => ps.isDeleted);
        builder.HasIndex(ps => ps.CreatedTime);
        builder.HasIndex(ps => ps.Key);
        builder.HasIndex(ps => ps.Value);
        builder.HasIndex(ps => ps.isUpdated);
    }
}

