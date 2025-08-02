namespace Capital.BL.Constants;

public static class CacheKeys
{
    public static class Category
    {
        private const string Prefix = "category_";
        public const string All = $"{Prefix}all";
        public static string ById(int id) => $"{Prefix}{id}";
    }

    public static class Brand
    {
        private const string Prefix = "brand_";
        public const string All = $"{Prefix}all";
        public static string ById(int id) => $"{Prefix}{id}";
    }

    public static class Product
    {
        private const string Prefix = "product_";
        public const string All = $"{Prefix}all";
        public static string ById(int id) => $"{Prefix}{id}";
        public static string ImagesById(int id) => $"{Prefix}images_{id}"; 
    }
}

