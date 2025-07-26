namespace Capital.BL.Utilities.Helpers;
public static class FileHelper
{
    public static int[] ParseIds(string ids) =>
        ids.Split(',').Select(int.Parse).ToArray(); 
}

