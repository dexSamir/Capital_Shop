using Capital.Core.Entities;
using Capital.DAL.Context;
using Microsoft.EntityFrameworkCore;

namespace Capital.DAL;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // Ensure database is created / migrated
        await context.Database.MigrateAsync();

        // ─── Categories ───────────────────────────────────────────
        if (!await context.Categories.AnyAsync())
        {
            var categories = new List<Category>
            {
                new() { Title = "Men's Clothing", ImageUrl = "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400", CreatedTime = DateTime.UtcNow },
                new() { Title = "Women's Clothing", ImageUrl = "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400", CreatedTime = DateTime.UtcNow },
                new() { Title = "Baby's Clothing", ImageUrl = "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400", CreatedTime = DateTime.UtcNow },
                new() { Title = "Accessories", ImageUrl = "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400", CreatedTime = DateTime.UtcNow },
                new() { Title = "Footwear", ImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", CreatedTime = DateTime.UtcNow },
                new() { Title = "Electronics", ImageUrl = "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400", CreatedTime = DateTime.UtcNow },
            };
            await context.Categories.AddRangeAsync(categories);
            await context.SaveChangesAsync();
        }

        // ─── Brands ───────────────────────────────────────────────
        if (!await context.Brands.AnyAsync())
        {
            var brands = new List<Brand>
            {
                new() { Title = "Nike", LogoUrl = "https://logo.clearbit.com/nike.com", Website = "https://nike.com", CreatedTime = DateTime.UtcNow },
                new() { Title = "Adidas", LogoUrl = "https://logo.clearbit.com/adidas.com", Website = "https://adidas.com", CreatedTime = DateTime.UtcNow },
                new() { Title = "Puma", LogoUrl = "https://logo.clearbit.com/puma.com", Website = "https://puma.com", CreatedTime = DateTime.UtcNow },
                new() { Title = "Zara", LogoUrl = "https://logo.clearbit.com/zara.com", Website = "https://zara.com", CreatedTime = DateTime.UtcNow },
                new() { Title = "H&M", LogoUrl = "https://logo.clearbit.com/hm.com", Website = "https://hm.com", CreatedTime = DateTime.UtcNow },
                new() { Title = "Gucci", LogoUrl = "https://logo.clearbit.com/gucci.com", Website = "https://gucci.com", CreatedTime = DateTime.UtcNow },
                new() { Title = "New Balance", LogoUrl = "https://logo.clearbit.com/newbalance.com", Website = "https://newbalance.com", CreatedTime = DateTime.UtcNow },
                new() { Title = "Under Armour", LogoUrl = "https://logo.clearbit.com/underarmour.com", Website = "https://underarmour.com", CreatedTime = DateTime.UtcNow },
            };
            await context.Brands.AddRangeAsync(brands);
            await context.SaveChangesAsync();
        }

        // ─── Products ─────────────────────────────────────────────
        if (!await context.Products.AnyAsync())
        {
            // Retrieve seeded categories & brands
            var cats = await context.Categories.ToDictionaryAsync(c => c.Title, c => c.Id);
            var brs = await context.Brands.ToDictionaryAsync(b => b.Title, b => b.Id);

            var products = new List<Product>
            {
                // Men's Clothing
                new()
                {
                    Title = "Premium Cotton T-Shirt",
                    Description = "High-quality 100% cotton crew neck t-shirt. Breathable fabric perfect for everyday wear.",
                    SellPrice = 29.99m, CostPrice = 12m, Discount = 10, Quantity = 150,
                    SKU = "MEN-TSH-001", CoverImage = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
                    SecondImage = "https://images.unsplash.com/photo-1622445275576-721325763afe?w=500",
                    CategoryId = cats["Men's Clothing"], BrandId = brs["Nike"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.2m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Slim Fit Denim Jeans",
                    Description = "Classic slim-fit denim jeans. Durable stretch fabric with modern silhouette.",
                    SellPrice = 59.99m, CostPrice = 25m, Discount = 15, Quantity = 100,
                    SKU = "MEN-JNS-002", CoverImage = "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
                    SecondImage = "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
                    CategoryId = cats["Men's Clothing"], BrandId = brs["Zara"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.5m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Leather Bomber Jacket",
                    Description = "Premium faux-leather bomber jacket with quilted lining. Perfect for autumn/winter.",
                    SellPrice = 149.99m, CostPrice = 60m, Discount = 0, Quantity = 40,
                    SKU = "MEN-JKT-003", CoverImage = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
                    CategoryId = cats["Men's Clothing"], BrandId = brs["Gucci"],
                    IsBestseller = false, IsNewArrival = true, Weight = 1.2m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Casual Linen Shirt",
                    Description = "Lightweight linen shirt in a relaxed fit. Ideal for summer days.",
                    SellPrice = 44.99m, CostPrice = 18m, Discount = 20, Quantity = 80,
                    SKU = "MEN-SHR-004", CoverImage = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
                    CategoryId = cats["Men's Clothing"], BrandId = brs["H&M"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.3m, CreatedTime = DateTime.UtcNow
                },

                // Women's Clothing
                new()
                {
                    Title = "Floral Print Maxi Dress",
                    Description = "Elegant floral print maxi dress. Flowing silhouette with adjustable waist tie.",
                    SellPrice = 79.99m, CostPrice = 30m, Discount = 25, Quantity = 60,
                    SKU = "WMN-DRS-001", CoverImage = "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
                    CategoryId = cats["Women's Clothing"], BrandId = brs["Zara"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.3m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "High-Waist Yoga Leggings",
                    Description = "Premium performance leggings with moisture-wicking technology.",
                    SellPrice = 54.99m, CostPrice = 20m, Discount = 10, Quantity = 120,
                    SKU = "WMN-LEG-002", CoverImage = "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500",
                    CategoryId = cats["Women's Clothing"], BrandId = brs["Nike"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.25m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Oversized Knit Sweater",
                    Description = "Cozy oversized knit sweater in soft wool blend. Perfect for layering.",
                    SellPrice = 64.99m, CostPrice = 28m, Discount = 0, Quantity = 75,
                    SKU = "WMN-SWT-003", CoverImage = "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
                    CategoryId = cats["Women's Clothing"], BrandId = brs["H&M"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.5m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Tailored Blazer",
                    Description = "Classic tailored blazer with structured shoulders. Perfect for office or evening.",
                    SellPrice = 119.99m, CostPrice = 50m, Discount = 10, Quantity = 45,
                    SKU = "WMN-BLZ-004", CoverImage = "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500",
                    CategoryId = cats["Women's Clothing"], BrandId = brs["Gucci"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.6m, CreatedTime = DateTime.UtcNow
                },

                // Baby's Clothing
                new()
                {
                    Title = "Organic Cotton Onesie Set",
                    Description = "3-pack organic cotton onesies for babies. Soft, hypoallergenic, and gentle on skin.",
                    SellPrice = 24.99m, CostPrice = 10m, Discount = 0, Quantity = 200,
                    SKU = "BBY-ONS-001", CoverImage = "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500",
                    CategoryId = cats["Baby's Clothing"], BrandId = brs["H&M"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.15m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Toddler Denim Overalls",
                    Description = "Adorable denim overalls for toddlers with adjustable straps and snap buttons.",
                    SellPrice = 34.99m, CostPrice = 14m, Discount = 15, Quantity = 90,
                    SKU = "BBY-OVR-002", CoverImage = "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500",
                    CategoryId = cats["Baby's Clothing"], BrandId = brs["Zara"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.2m, CreatedTime = DateTime.UtcNow
                },

                // Accessories
                new()
                {
                    Title = "Classic Leather Watch",
                    Description = "Elegant analog watch with genuine leather strap and stainless steel case.",
                    SellPrice = 89.99m, CostPrice = 35m, Discount = 5, Quantity = 50,
                    SKU = "ACC-WTC-001", CoverImage = "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500",
                    CategoryId = cats["Accessories"], BrandId = null,
                    IsBestseller = true, IsNewArrival = false, Weight = 0.1m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Polarized Sunglasses",
                    Description = "UV400 polarized sunglasses with lightweight metal frame. Includes carrying case.",
                    SellPrice = 39.99m, CostPrice = 12m, Discount = 20, Quantity = 130,
                    SKU = "ACC-SNG-002", CoverImage = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
                    CategoryId = cats["Accessories"], BrandId = null,
                    IsBestseller = false, IsNewArrival = true, Weight = 0.05m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Canvas Backpack",
                    Description = "Durable canvas backpack with laptop compartment and multiple pockets.",
                    SellPrice = 49.99m, CostPrice = 20m, Discount = 0, Quantity = 75,
                    SKU = "ACC-BAG-003", CoverImage = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
                    CategoryId = cats["Accessories"], BrandId = brs["Nike"],
                    IsBestseller = false, IsNewArrival = false, Weight = 0.6m, CreatedTime = DateTime.UtcNow
                },

                // Footwear
                new()
                {
                    Title = "Air Max Running Shoes",
                    Description = "Lightweight running shoes with air cushion technology. Breathable mesh upper.",
                    SellPrice = 129.99m, CostPrice = 55m, Discount = 10, Quantity = 80,
                    SKU = "FTW-RUN-001", CoverImage = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
                    SecondImage = "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500",
                    CategoryId = cats["Footwear"], BrandId = brs["Nike"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.35m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Classic Suede Sneakers",
                    Description = "Retro-inspired suede sneakers with gum rubber sole. Versatile everyday shoe.",
                    SellPrice = 84.99m, CostPrice = 35m, Discount = 0, Quantity = 65,
                    SKU = "FTW-SNK-002", CoverImage = "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
                    CategoryId = cats["Footwear"], BrandId = brs["Puma"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.4m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Ultraboost Running Shoes",
                    Description = "High-performance running shoes with Boost midsole technology.",
                    SellPrice = 179.99m, CostPrice = 75m, Discount = 15, Quantity = 55,
                    SKU = "FTW-RUN-003", CoverImage = "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500",
                    CategoryId = cats["Footwear"], BrandId = brs["Adidas"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.3m, CreatedTime = DateTime.UtcNow
                },

                // Electronics
                new()
                {
                    Title = "Wireless Bluetooth Earbuds",
                    Description = "True wireless earbuds with active noise cancellation. 24h battery with case.",
                    SellPrice = 69.99m, CostPrice = 25m, Discount = 10, Quantity = 200,
                    SKU = "ELC-EAR-001", CoverImage = "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=500",
                    CategoryId = cats["Electronics"], BrandId = null,
                    IsBestseller = true, IsNewArrival = false, Weight = 0.05m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Smart Fitness Tracker",
                    Description = "Advanced fitness tracker with heart rate monitor, GPS, and sleep tracking.",
                    SellPrice = 99.99m, CostPrice = 40m, Discount = 5, Quantity = 100,
                    SKU = "ELC-FIT-002", CoverImage = "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500",
                    CategoryId = cats["Electronics"], BrandId = brs["Under Armour"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.04m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Portable Bluetooth Speaker",
                    Description = "Waterproof portable speaker with 360° sound and 12h battery life.",
                    SellPrice = 44.99m, CostPrice = 18m, Discount = 0, Quantity = 150,
                    SKU = "ELC-SPK-003", CoverImage = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
                    CategoryId = cats["Electronics"], BrandId = null,
                    IsBestseller = false, IsNewArrival = false, Weight = 0.3m, CreatedTime = DateTime.UtcNow
                },
            };

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();
        }
    }
}
