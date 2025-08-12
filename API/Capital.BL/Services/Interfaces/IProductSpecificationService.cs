using Capital.BL.DTOs.ProductSpecificationDtos;

namespace Capital.BL.Services.Interfaces;

public interface IProductSpecificationService
{
    Task<IEnumerable<ProductSpecificationGetDto>> GetByProductIdAsync(int productId);
    Task<ProductSpecificationGetDto> GetByIdAsync(int id);
    Task<ProductSpecificationGetDto> CreateAsync(ProductSpecificationCreateDto dto);
    Task<ProductSpecificationGetDto> UpdateAsync(int id, ProductSpecificationUpdateDto dto);
    Task<bool> DeleteAsync(int id);
    Task RemoveAllFromProductAsync(int productId);
}

