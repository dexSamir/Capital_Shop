using Capital.BL.DTOs.ProductImageDto;
using Capital.BL.Utilities.Enums;
using Microsoft.AspNetCore.Http;
namespace Capital.BL.Services.Interfaces;

public interface IProductImageService
{
    Task AddImagesAsync(int productId, IEnumerable<IFormFile> Images, bool isPrimary = false, bool isSecondary = false);
    Task DeleteImagesAsync(int[] imageId, EDeleteType dType);
    Task<IEnumerable<ProductImageGetDto>> GetImagesByProductIdAsync(int productId);
    Task<ProductImageGetDto?> GetByIdAsync(int imageId);
    Task<bool> SetPrimaryImageAsync(int productId, int imageId);
    Task<bool> SetSecondaryImageAsync(int productId, int imageId);
    Task UpdateAltTextAsync(int imageId, string altText);
    Task DeleteAllByProductIdAsync(int productId, EDeleteType dType);
}

