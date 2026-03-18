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

                new()
                {
                    Title = "Premium Cotton T-Shirt",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 29.99m, CostPrice = 12.00m, Discount = 0, Quantity = 100,
                    SKU = "MEN-ITM-001", CoverImage = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
                    CategoryId = cats["Men's Clothing"], BrandId = brs["Nike"],
                    IsBestseller = false, IsNewArrival = false, Weight = 0.45m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Slim Fit Denim Jeans",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 59.99m, CostPrice = 24.00m, Discount = 0, Quantity = 100,
                    SKU = "MEN-ITM-002", CoverImage = "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
                    CategoryId = cats["Men's Clothing"], BrandId = brs["Zara"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.37m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Leather Bomber Jacket",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 149.99m, CostPrice = 60.00m, Discount = 0, Quantity = 100,
                    SKU = "MEN-ITM-003", CoverImage = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
                    CategoryId = cats["Men's Clothing"], BrandId = brs["Gucci"],
                    IsBestseller = false, IsNewArrival = false, Weight = 0.35m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Casual Linen Shirt",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 44.99m, CostPrice = 18.00m, Discount = 0, Quantity = 100,
                    SKU = "MEN-ITM-004", CoverImage = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
                    CategoryId = cats["Men's Clothing"], BrandId = brs["H&M"],
                    IsBestseller = true, IsNewArrival = true, Weight = 0.32m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "V-Neck Sweater",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 49.99m, CostPrice = 20.00m, Discount = 15, Quantity = 100,
                    SKU = "MEN-ITM-005", CoverImage = "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500",
                    CategoryId = cats["Men's Clothing"], BrandId = brs["Puma"],
                    IsBestseller = true, IsNewArrival = true, Weight = 0.47m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Classic Chinos",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 39.99m, CostPrice = 16.00m, Discount = 15, Quantity = 100,
                    SKU = "MEN-ITM-006", CoverImage = "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500",
                    CategoryId = cats["Men's Clothing"], BrandId = brs["Zara"],
                    IsBestseller = true, IsNewArrival = true, Weight = 0.38m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Graphic Print T-Shirt",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 34.99m, CostPrice = 14.00m, Discount = 15, Quantity = 100,
                    SKU = "MEN-ITM-007", CoverImage = "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500",
                    CategoryId = cats["Men's Clothing"], BrandId = brs["Adidas"],
                    IsBestseller = false, IsNewArrival = false, Weight = 0.83m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Activewear Zip-Up Hoodie",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 79.99m, CostPrice = 32.00m, Discount = 15, Quantity = 100,
                    SKU = "MEN-ITM-008", CoverImage = "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
                    CategoryId = cats["Men's Clothing"], BrandId = brs["Under Armour"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.19m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Formal Dress Shirt",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 35.99m, CostPrice = 14.40m, Discount = 0, Quantity = 100,
                    SKU = "MEN-ITM-009", CoverImage = "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500",
                    CategoryId = cats["Men's Clothing"], BrandId = brs["H&M"],
                    IsBestseller = true, IsNewArrival = true, Weight = 0.89m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Running Shorts",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 25.99m, CostPrice = 10.40m, Discount = 0, Quantity = 100,
                    SKU = "MEN-ITM-010", CoverImage = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500",
                    CategoryId = cats["Men's Clothing"], BrandId = brs["Nike"],
                    IsBestseller = false, IsNewArrival = false, Weight = 0.44m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Floral Print Maxi Dress",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 79.99m, CostPrice = 32.00m, Discount = 0, Quantity = 100,
                    SKU = "WOM-ITM-011", CoverImage = "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
                    CategoryId = cats["Women's Clothing"], BrandId = brs["Zara"],
                    IsBestseller = false, IsNewArrival = false, Weight = 0.75m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "High-Waist Yoga Leggings",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 54.99m, CostPrice = 22.00m, Discount = 0, Quantity = 100,
                    SKU = "WOM-ITM-012", CoverImage = "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500",
                    CategoryId = cats["Women's Clothing"], BrandId = brs["Nike"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.23m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Oversized Knit Sweater",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 64.99m, CostPrice = 26.00m, Discount = 0, Quantity = 100,
                    SKU = "WOM-ITM-013", CoverImage = "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
                    CategoryId = cats["Women's Clothing"], BrandId = brs["H&M"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.90m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Tailored Blazer",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 119.99m, CostPrice = 48.00m, Discount = 0, Quantity = 100,
                    SKU = "WOM-ITM-014", CoverImage = "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500",
                    CategoryId = cats["Women's Clothing"], BrandId = brs["Gucci"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.38m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Summer Wrap Dress",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 59.99m, CostPrice = 24.00m, Discount = 15, Quantity = 100,
                    SKU = "WOM-ITM-015", CoverImage = "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=500",
                    CategoryId = cats["Women's Clothing"], BrandId = brs["Zara"],
                    IsBestseller = false, IsNewArrival = false, Weight = 0.14m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Active Tank Top",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 29.99m, CostPrice = 12.00m, Discount = 15, Quantity = 100,
                    SKU = "WOM-ITM-016", CoverImage = "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=500",
                    CategoryId = cats["Women's Clothing"], BrandId = brs["Adidas"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.18m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Plush Cardigan",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 45.99m, CostPrice = 18.40m, Discount = 15, Quantity = 100,
                    SKU = "WOM-ITM-017", CoverImage = "https://images.unsplash.com/photo-1434389674669-e08b4cac3105?w=500",
                    CategoryId = cats["Women's Clothing"], BrandId = brs["H&M"],
                    IsBestseller = true, IsNewArrival = true, Weight = 0.11m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Skinny Jeans",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 49.99m, CostPrice = 20.00m, Discount = 15, Quantity = 100,
                    SKU = "WOM-ITM-018", CoverImage = "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
                    CategoryId = cats["Women's Clothing"], BrandId = brs["Zara"],
                    IsBestseller = false, IsNewArrival = false, Weight = 0.90m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Puffer Coat",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 129.99m, CostPrice = 52.00m, Discount = 0, Quantity = 100,
                    SKU = "WOM-ITM-019", CoverImage = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
                    CategoryId = cats["Women's Clothing"], BrandId = brs["Puma"],
                    IsBestseller = false, IsNewArrival = false, Weight = 0.60m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Silky Blouse",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 89.99m, CostPrice = 36.00m, Discount = 15, Quantity = 100,
                    SKU = "WOM-ITM-020", CoverImage = "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=500",
                    CategoryId = cats["Women's Clothing"], BrandId = brs["Gucci"],
                    IsBestseller = true, IsNewArrival = true, Weight = 0.65m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Organic Cotton Onesie Set",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 24.99m, CostPrice = 10.00m, Discount = 15, Quantity = 100,
                    SKU = "BAB-ITM-021", CoverImage = "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500",
                    CategoryId = cats["Baby's Clothing"], BrandId = brs["H&M"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.41m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Toddler Denim Overalls",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 34.99m, CostPrice = 14.00m, Discount = 0, Quantity = 100,
                    SKU = "BAB-ITM-022", CoverImage = "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500",
                    CategoryId = cats["Baby's Clothing"], BrandId = brs["Zara"],
                    IsBestseller = true, IsNewArrival = true, Weight = 0.16m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Fleece SleepSack",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 19.99m, CostPrice = 8.00m, Discount = 0, Quantity = 100,
                    SKU = "BAB-ITM-023", CoverImage = "https://images.unsplash.com/photo-1434389674669-e08b4cac3105?w=500",
                    CategoryId = cats["Baby's Clothing"], BrandId = brs["Zara"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.84m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Baby Cardigan",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 22.99m, CostPrice = 9.20m, Discount = 0, Quantity = 100,
                    SKU = "BAB-ITM-024", CoverImage = "https://images.unsplash.com/photo-1604467794349-0b74285de7e7?w=500",
                    CategoryId = cats["Baby's Clothing"], BrandId = brs["H&M"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.51m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Knit Beanies (2-pack)",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 14.99m, CostPrice = 6.00m, Discount = 0, Quantity = 100,
                    SKU = "BAB-ITM-025", CoverImage = "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
                    CategoryId = cats["Baby's Clothing"], BrandId = brs["H&M"],
                    IsBestseller = false, IsNewArrival = false, Weight = 0.37m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Baby Jogger Pants",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 28.99m, CostPrice = 11.60m, Discount = 15, Quantity = 100,
                    SKU = "BAB-ITM-026", CoverImage = "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500",
                    CategoryId = cats["Baby's Clothing"], BrandId = brs["Nike"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.57m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Soft Sole Booties",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 18.99m, CostPrice = 7.60m, Discount = 15, Quantity = 100,
                    SKU = "BAB-ITM-027", CoverImage = "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=500",
                    CategoryId = cats["Baby's Clothing"], BrandId = brs["Adidas"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.34m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Classic Leather Watch",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 89.99m, CostPrice = 36.00m, Discount = 0, Quantity = 100,
                    SKU = "ACC-ITM-028", CoverImage = "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500",
                    CategoryId = cats["Accessories"], BrandId = brs["Gucci"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.11m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Polarized Sunglasses",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 39.99m, CostPrice = 16.00m, Discount = 0, Quantity = 100,
                    SKU = "ACC-ITM-029", CoverImage = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500",
                    CategoryId = cats["Accessories"], BrandId = brs["Zara"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.88m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Canvas Backpack",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 49.99m, CostPrice = 20.00m, Discount = 0, Quantity = 100,
                    SKU = "ACC-ITM-030", CoverImage = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
                    CategoryId = cats["Accessories"], BrandId = brs["Nike"],
                    IsBestseller = true, IsNewArrival = true, Weight = 0.85m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Designer Leather Belt",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 150m, CostPrice = 60.00m, Discount = 15, Quantity = 100,
                    SKU = "ACC-ITM-031", CoverImage = "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500",
                    CategoryId = cats["Accessories"], BrandId = brs["Gucci"],
                    IsBestseller = false, IsNewArrival = false, Weight = 0.17m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Knit Scarf",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 25.99m, CostPrice = 10.40m, Discount = 15, Quantity = 100,
                    SKU = "ACC-ITM-032", CoverImage = "https://images.unsplash.com/photo-1604467794349-0b74285de7e7?w=500",
                    CategoryId = cats["Accessories"], BrandId = brs["H&M"],
                    IsBestseller = true, IsNewArrival = true, Weight = 0.71m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Sports Cap",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 22.99m, CostPrice = 9.20m, Discount = 0, Quantity = 100,
                    SKU = "ACC-ITM-033", CoverImage = "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500",
                    CategoryId = cats["Accessories"], BrandId = brs["Adidas"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.15m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Travel Duffle Bag",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 65.99m, CostPrice = 26.40m, Discount = 0, Quantity = 100,
                    SKU = "ACC-ITM-034", CoverImage = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
                    CategoryId = cats["Accessories"], BrandId = brs["Puma"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.78m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Crossbody Bag",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 45.99m, CostPrice = 18.40m, Discount = 0, Quantity = 100,
                    SKU = "ACC-ITM-035", CoverImage = "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500",
                    CategoryId = cats["Accessories"], BrandId = brs["Zara"],
                    IsBestseller = true, IsNewArrival = true, Weight = 0.15m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Air Max Running Shoes",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 129.99m, CostPrice = 52.00m, Discount = 0, Quantity = 100,
                    SKU = "FOO-ITM-036", CoverImage = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
                    CategoryId = cats["Footwear"], BrandId = brs["Nike"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.52m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Classic Suede Sneakers",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 84.99m, CostPrice = 34.00m, Discount = 0, Quantity = 100,
                    SKU = "FOO-ITM-037", CoverImage = "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500",
                    CategoryId = cats["Footwear"], BrandId = brs["Puma"],
                    IsBestseller = false, IsNewArrival = false, Weight = 0.74m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Ultraboost Running Shoes",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 179.99m, CostPrice = 72.00m, Discount = 0, Quantity = 100,
                    SKU = "FOO-ITM-038", CoverImage = "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500",
                    CategoryId = cats["Footwear"], BrandId = brs["Adidas"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.32m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Leather Loafers",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 89.99m, CostPrice = 36.00m, Discount = 0, Quantity = 100,
                    SKU = "FOO-ITM-039", CoverImage = "https://images.unsplash.com/photo-1614252235314-8561cd9d569f?w=500",
                    CategoryId = cats["Footwear"], BrandId = brs["Zara"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.77m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Ankle Boots",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 59.99m, CostPrice = 24.00m, Discount = 0, Quantity = 100,
                    SKU = "FOO-ITM-040", CoverImage = "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500",
                    CategoryId = cats["Footwear"], BrandId = brs["H&M"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.49m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Basketball Shoes",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 140m, CostPrice = 56.00m, Discount = 0, Quantity = 100,
                    SKU = "FOO-ITM-041", CoverImage = "https://images.unsplash.com/photo-1552346154-21d32810baa3?w=500",
                    CategoryId = cats["Footwear"], BrandId = brs["Under Armour"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.86m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Trainer X PRO",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 120m, CostPrice = 48.00m, Discount = 0, Quantity = 100,
                    SKU = "FOO-ITM-042", CoverImage = "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500",
                    CategoryId = cats["Footwear"], BrandId = brs["New Balance"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.50m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Slip-On Canvas Shoes",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 45m, CostPrice = 18.00m, Discount = 15, Quantity = 100,
                    SKU = "FOO-ITM-043", CoverImage = "https://images.unsplash.com/photo-1620809241838-8c1dcd53e20e?w=500",
                    CategoryId = cats["Footwear"], BrandId = brs["Puma"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.13m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Wireless Bluetooth Earbuds",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 69.99m, CostPrice = 28.00m, Discount = 15, Quantity = 100,
                    SKU = "ELE-ITM-044", CoverImage = "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=500",
                    CategoryId = cats["Electronics"], BrandId = brs["Nike"],
                    IsBestseller = false, IsNewArrival = false, Weight = 0.19m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Smart Fitness Tracker",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 99.99m, CostPrice = 40.00m, Discount = 0, Quantity = 100,
                    SKU = "ELE-ITM-045", CoverImage = "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500",
                    CategoryId = cats["Electronics"], BrandId = brs["Under Armour"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.82m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Portable Bluetooth Speaker",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 44.99m, CostPrice = 18.00m, Discount = 0, Quantity = 100,
                    SKU = "ELE-ITM-046", CoverImage = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
                    CategoryId = cats["Electronics"], BrandId = brs["Puma"],
                    IsBestseller = true, IsNewArrival = false, Weight = 0.32m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Noise Cancelling Headphones",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 199.99m, CostPrice = 80.00m, Discount = 0, Quantity = 100,
                    SKU = "ELE-ITM-047", CoverImage = "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500",
                    CategoryId = cats["Electronics"], BrandId = brs["Adidas"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.36m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Performance Smartwatch",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 249.99m, CostPrice = 100.00m, Discount = 0, Quantity = 100,
                    SKU = "ELE-ITM-048", CoverImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
                    CategoryId = cats["Electronics"], BrandId = brs["Nike"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.20m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Action Camera HD",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 150m, CostPrice = 60.00m, Discount = 0, Quantity = 100,
                    SKU = "ELE-ITM-049", CoverImage = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500",
                    CategoryId = cats["Electronics"], BrandId = brs["Under Armour"],
                    IsBestseller = false, IsNewArrival = false, Weight = 0.79m, CreatedTime = DateTime.UtcNow
                },
                new()
                {
                    Title = "Ergonomic Mouse",
                    Description = "High-quality item suitable for daily wear. Made from durable and premium materials.",
                    SellPrice = 29.99m, CostPrice = 12.00m, Discount = 0, Quantity = 100,
                    SKU = "ELE-ITM-050", CoverImage = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
                    CategoryId = cats["Electronics"], BrandId = brs["New Balance"],
                    IsBestseller = false, IsNewArrival = true, Weight = 0.77m, CreatedTime = DateTime.UtcNow
                }
            };
            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();
        }
    }
}
