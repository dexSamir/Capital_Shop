using Capital.Core.Entities;
using Capital.DAL.Context;
using Microsoft.EntityFrameworkCore;

namespace Capital.DAL;

public static class DbInitializer
{
    private const string DemoVideoUrl = "https://samplelib.com/lib/preview/mp4/sample-5s.mp4";

    public static async Task SeedAsync(AppDbContext context)
    {
        await context.Database.MigrateAsync();

        if (!await context.Categories.AnyAsync())
        {
            await context.Categories.AddRangeAsync(
                new Category { Title = "Men's Clothing", ImageUrl = "https://picsum.photos/id/1005/600/600", CreatedTime = DateTime.UtcNow },
                new Category { Title = "Women's Clothing", ImageUrl = "https://picsum.photos/id/1011/600/600", CreatedTime = DateTime.UtcNow },
                new Category { Title = "Accessories", ImageUrl = "https://picsum.photos/id/1025/600/600", CreatedTime = DateTime.UtcNow },
                new Category { Title = "Footwear", ImageUrl = "https://picsum.photos/id/21/600/600", CreatedTime = DateTime.UtcNow },
                new Category { Title = "Electronics", ImageUrl = "https://picsum.photos/id/180/600/600", CreatedTime = DateTime.UtcNow }
            );
            await context.SaveChangesAsync();
        }

        if (!await context.Brands.AnyAsync())
        {
            await context.Brands.AddRangeAsync(
                new Brand { Title = "Nike", Website = "https://www.nike.com", LogoUrl = "https://logo.clearbit.com/nike.com", CreatedTime = DateTime.UtcNow },
                new Brand { Title = "Adidas", Website = "https://www.adidas.com", LogoUrl = "https://logo.clearbit.com/adidas.com", CreatedTime = DateTime.UtcNow },
                new Brand { Title = "Zara", Website = "https://www.zara.com", LogoUrl = "https://logo.clearbit.com/zara.com", CreatedTime = DateTime.UtcNow },
                new Brand { Title = "Puma", Website = "https://us.puma.com", LogoUrl = "https://logo.clearbit.com/puma.com", CreatedTime = DateTime.UtcNow },
                new Brand { Title = "Apple", Website = "https://www.apple.com", LogoUrl = "https://logo.clearbit.com/apple.com", CreatedTime = DateTime.UtcNow }
            );
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
