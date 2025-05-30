﻿using Capital.Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Capital.DAL.Context;
public class AppDbContext : IdentityDbContext<User>
{
    public AppDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }
	public DbSet<Review> Reviews { get; set; }
	public DbSet<Brand> Brands { get; set; }
	public DbSet<ProductRating> Ratings { get; set; }
	public DbSet<ProductImage> Images { get; set; }
	public DbSet<ProductAttribute> Attributes { get; set; }
	public DbSet<ProductSpecification> Specifications { get; set; }
	public DbSet<Category> Categories { get; set; }
	public DbSet<Coupon> Coupons { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        base.OnModelCreating(builder);
    }

}

