namespace Capital.BL.Constants;

public static class CacheKeys
{
    //Categories; 
    public const string AllCategories = "all_categories";
    public static string CategoryById(int id) => $"category_{id}";
}

