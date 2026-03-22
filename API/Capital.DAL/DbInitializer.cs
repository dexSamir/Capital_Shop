using System.Collections.Generic;
using Capital.Core.Entities;
using Capital.DAL.Context;
using Microsoft.EntityFrameworkCore;

namespace Capital.DAL;

public static class DbInitializer
{
    private const string DemoVideoUrl = "https://samplelib.com/lib/preview/mp4/sample-5s.mp4";

    private static readonly Dictionary<string, (string Sku, int Quantity)> ProductSkuQuantityByTitle =
        new(StringComparer.Ordinal)
        {
            ["Premium Cotton T-Shirt"] = ("MEN-001", 128),
            ["Urban Denim Jacket"] = ("MEN-002", 96),
            ["Elegant Silk Dress"] = ("WOM-001", 84),
            ["Classic Leather Belt"] = ("ACC-001", 200),
            ["Runner Pro Sneakers"] = ("FOO-001", 156),
            ["Wireless Noise-Cancel Headphones"] = ("ELE-001", 72),
        };

    private static readonly Dictionary<string, string> BrandLogoUrlByTitle =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["Nike"] = "https://picsum.photos/seed/capital-brand-nike/240/240",
            ["Adidas"] = "https://picsum.photos/seed/capital-brand-adidas/240/240",
            ["Zara"] = "https://picsum.photos/seed/capital-brand-zara/240/240",
            ["Puma"] = "https://picsum.photos/seed/capital-brand-puma/240/240",
            ["Apple"] = "https://picsum.photos/seed/capital-brand-apple/240/240",
        };

    public static async Task SeedAsync(AppDbContext context)
    {
        await context.Database.MigrateAsync();

        var requiredCategories = new List<Category>
        {
            new() { Title = "Men's Clothing", ImageUrl = "https://picsum.photos/id/1005/600/600", CreatedTime = DateTime.UtcNow },
            new() { Title = "Women's Clothing", ImageUrl = "https://picsum.photos/id/1011/600/600", CreatedTime = DateTime.UtcNow },
            new() { Title = "Accessories", ImageUrl = "https://picsum.photos/id/1025/600/600", CreatedTime = DateTime.UtcNow },
            new() { Title = "Footwear", ImageUrl = "https://picsum.photos/id/21/600/600", CreatedTime = DateTime.UtcNow },
            new() { Title = "Electronics", ImageUrl = "https://picsum.photos/id/180/600/600", CreatedTime = DateTime.UtcNow }
        };

        var existingCategoryTitles = await context.Categories
            .Select(c => c.Title)
            .ToListAsync();
        var missingCategories = requiredCategories
            .Where(c => !existingCategoryTitles.Contains(c.Title))
            .ToList();
        if (missingCategories.Count > 0)
        {
            await context.Categories.AddRangeAsync(missingCategories);
            await context.SaveChangesAsync();
        }

        var requiredBrands = new List<Brand>
        {
            new() { Title = "Nike", Website = "https://www.nike.com", LogoUrl = BrandLogoUrlByTitle["Nike"], CreatedTime = DateTime.UtcNow },
            new() { Title = "Adidas", Website = "https://www.adidas.com", LogoUrl = BrandLogoUrlByTitle["Adidas"], CreatedTime = DateTime.UtcNow },
            new() { Title = "Zara", Website = "https://www.zara.com", LogoUrl = BrandLogoUrlByTitle["Zara"], CreatedTime = DateTime.UtcNow },
            new() { Title = "Puma", Website = "https://us.puma.com", LogoUrl = BrandLogoUrlByTitle["Puma"], CreatedTime = DateTime.UtcNow },
            new() { Title = "Apple", Website = "https://www.apple.com", LogoUrl = BrandLogoUrlByTitle["Apple"], CreatedTime = DateTime.UtcNow }
        };

        var existingBrandTitles = await context.Brands
            .Select(b => b.Title)
            .ToListAsync();
        var missingBrands = requiredBrands
            .Where(b => !existingBrandTitles.Contains(b.Title))
            .ToList();
        if (missingBrands.Count > 0)
        {
            await context.Brands.AddRangeAsync(missingBrands);
            await context.SaveChangesAsync();
        }

        var shouldRefreshProducts =
            !await context.Products.AnyAsync() ||
            await context.Products.AnyAsync(p =>
                p.SecondImage == null ||
                p.VideoUrl == null ||
                !p.Images.Any());

        if (shouldRefreshProducts)
        {
            await context.ReviewReactions.ExecuteDeleteAsync();
            await context.Reviews.ExecuteDeleteAsync();
            await context.Ratings.ExecuteDeleteAsync();
            await context.ProductAttributeValues.ExecuteDeleteAsync();
            await context.Specifications.ExecuteDeleteAsync();
            await context.Images.ExecuteDeleteAsync();
            await context.Products.ExecuteDeleteAsync();

            var categoryMap = await context.Categories.ToDictionaryAsync(c => c.Title, c => c.Id);
            var brandMap = await context.Brands.ToDictionaryAsync(b => b.Title, b => b.Id);

            var products = new List<Product>
            {
                BuildProduct(
                    title: "Premium Cotton T-Shirt",
                    sku: "MEN-001",
                    categoryId: categoryMap["Men's Clothing"],
                    brandId: brandMap["Nike"],
                    sellPrice: 39.99m,
                    costPrice: 16.50m,
                    coverImage: "https://picsum.photos/id/1012/900/1100",
                    secondImage: "https://picsum.photos/id/1020/900/1100",
                    gallery1: "https://picsum.photos/id/1021/900/1100",
                    gallery2: "https://picsum.photos/id/1024/900/1100",
                    specs: new Dictionary<string, string> { ["Material"] = "100% Cotton", ["Fit"] = "Regular" }),

                BuildProduct(
                    title: "Urban Denim Jacket",
                    sku: "MEN-002",
                    categoryId: categoryMap["Men's Clothing"],
                    brandId: brandMap["Zara"],
                    sellPrice: 109.99m,
                    costPrice: 54.00m,
                    coverImage: "https://picsum.photos/id/1039/900/1100",
                    secondImage: "https://picsum.photos/id/1040/900/1100",
                    gallery1: "https://picsum.photos/id/1041/900/1100",
                    gallery2: "https://picsum.photos/id/1042/900/1100",
                    specs: new Dictionary<string, string> { ["Material"] = "Denim", ["Season"] = "All Season" }),

                BuildProduct(
                    title: "Elegant Silk Dress",
                    sku: "WOM-001",
                    categoryId: categoryMap["Women's Clothing"],
                    brandId: brandMap["Adidas"],
                    sellPrice: 129.99m,
                    costPrice: 63.00m,
                    coverImage: "https://picsum.photos/id/1062/900/1100",
                    secondImage: "https://picsum.photos/id/1063/900/1100",
                    gallery1: "https://picsum.photos/id/1064/900/1100",
                    gallery2: "https://picsum.photos/id/1065/900/1100",
                    specs: new Dictionary<string, string> { ["Fabric"] = "Silk Blend", ["Length"] = "Midi" }),

                BuildProduct(
                    title: "Classic Leather Belt",
                    sku: "ACC-001",
                    categoryId: categoryMap["Accessories"],
                    brandId: brandMap["Puma"],
                    sellPrice: 49.99m,
                    costPrice: 21.00m,
                    coverImage: "https://picsum.photos/id/1069/900/1100",
                    secondImage: "https://picsum.photos/id/1070/900/1100",
                    gallery1: "https://picsum.photos/id/1071/900/1100",
                    gallery2: "https://picsum.photos/id/1072/900/1100",
                    specs: new Dictionary<string, string> { ["Material"] = "Genuine Leather", ["Width"] = "3.5 cm" }),

                BuildProduct(
                    title: "Runner Pro Sneakers",
                    sku: "FOO-001",
                    categoryId: categoryMap["Footwear"],
                    brandId: brandMap["Nike"],
                    sellPrice: 149.99m,
                    costPrice: 72.00m,
                    coverImage: "https://picsum.photos/id/1081/900/1100",
                    secondImage: "https://picsum.photos/id/1082/900/1100",
                    gallery1: "https://picsum.photos/id/1083/900/1100",
                    gallery2: "https://picsum.photos/id/1084/900/1100",
                    specs: new Dictionary<string, string> { ["Sole"] = "Rubber", ["Weight"] = "290g" }),

                BuildProduct(
                    title: "Wireless Noise-Cancel Headphones",
                    sku: "ELE-001",
                    categoryId: categoryMap["Electronics"],
                    brandId: brandMap["Apple"],
                    sellPrice: 249.99m,
                    costPrice: 145.00m,
                    coverImage: "https://picsum.photos/id/180/900/1100",
                    secondImage: "https://picsum.photos/id/201/900/1100",
                    gallery1: "https://picsum.photos/id/160/900/1100",
                    gallery2: "https://picsum.photos/id/250/900/1100",
                    specs: new Dictionary<string, string> { ["Battery"] = "30 hours", ["Connectivity"] = "Bluetooth 5.3" })
            };

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();
        }

        await SyncBrandLogosAsync(context);
        await RefreshAllProductSkuAndQuantityAsync(context);
    }

    private static async Task SyncBrandLogosAsync(AppDbContext context)
    {
        var brands = await context.Brands.ToListAsync();
        var changed = false;
        foreach (var b in brands)
        {
            if (!BrandLogoUrlByTitle.TryGetValue(b.Title, out var url))
                continue;
            if (string.IsNullOrWhiteSpace(b.LogoUrl) ||
                b.LogoUrl.Contains("clearbit", StringComparison.OrdinalIgnoreCase))
            {
                b.LogoUrl = url;
                changed = true;
            }
        }
        if (changed)
            await context.SaveChangesAsync();
    }

    private static async Task RefreshAllProductSkuAndQuantityAsync(AppDbContext context)
    {
        var products = await context.Products.ToListAsync();
        if (products.Count == 0)
            return;

        foreach (var p in products.OrderBy(x => x.Id))
        {
            if (ProductSkuQuantityByTitle.TryGetValue(p.Title, out var sq))
            {
                p.SKU = sq.Sku;
                p.Quantity = sq.Quantity;
            }
            else
            {
                p.SKU = $"CS-{p.Id:D5}";
                p.Quantity = 48 + (p.Id % 152);
            }
        }

        await context.SaveChangesAsync();
    }

    private static Product BuildProduct(
        string title,
        string sku,
        int categoryId,
        int brandId,
        decimal sellPrice,
        decimal costPrice,
        string coverImage,
        string secondImage,
        string gallery1,
        string gallery2,
        Dictionary<string, string> specs)
    {
        return new Product
        {
            Title = title,
            Description = $"{title} - premium quality product with modern design.",
            SKU = sku,
            CategoryId = categoryId,
            BrandId = brandId,
            SellPrice = sellPrice,
            CostPrice = costPrice,
            Discount = 10,
            Quantity = 120,
            CoverImage = coverImage,
            SecondImage = secondImage,
            VideoUrl = DemoVideoUrl,
            Weight = 0.6m,
            IsBestseller = true,
            IsNewArrival = true,
            CreatedTime = DateTime.UtcNow,
            Images = new List<ProductImage>
            {
                new() { ImageUrl = gallery1, AltText = $"{title} view 1", IsPrimary = true, IsSecondary = false, CreatedTime = DateTime.UtcNow },
                new() { ImageUrl = gallery2, AltText = $"{title} view 2", IsPrimary = false, IsSecondary = true, CreatedTime = DateTime.UtcNow }
            },
            Specifications = specs.Select(x => new ProductSpecification
            {
                Key = x.Key,
                Value = x.Value,
                CreatedTime = DateTime.UtcNow
            }).ToList()
        };
    }
}
