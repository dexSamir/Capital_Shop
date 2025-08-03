using Capital.BL.DTOs.ProductImageDto;
using Capital.BL.Utilities.Enums;
namespace Capital.BL.Services.Interfaces;

public interface IProductImageService
{
    Task AddImagesAsync(int productId, IList<ProductImageCreateDto> dtos);
    Task<IEnumerable<ProductImageGetDto>> GetImagesByProductIdAsync(int productId);
    Task<ProductImageGetDto?> GetByIdAsync(int imageId);

    Task<bool> SetPrimaryImageAsync(int productId, int imageId);
    Task<bool> SetSecondaryImageAsync(int productId, int imageId);
    Task UpdateAltTextAsync(int imageId, string altText);

    Task DeleteImagesAsync(int[] imageId, EDeleteType dType);
}

