using Capital.BL.DTOs.ProductDtos;
using Capital.BL.Utilities.Enums;

namespace Capital.BL.Services.Interfaces;

public interface IProductService
{
    Task<IEnumerable<ProductGetDto>> GetAllAsync(ProductFilterDto dto);
    Task<ProductDetailDto> GetByIdAsync(int id);

    Task<ProductGetDto> CreateAsync(ProductCreateDto dto);
    Task<IEnumerable<ProductGetDto>> CreateBulkAsync(IEnumerable<ProductCreateDto> dtos);

    Task<ProductGetDto> UpdateAsync(int id, ProductUpdateDto dto);
    Task<bool> DeleteAsync(int[] ids, EDeleteType dType);

    //Task<IEnumerable<ProductGetDto>> SortedAndFilteredProductsAsync(ProductFilterDto dto);
}   

