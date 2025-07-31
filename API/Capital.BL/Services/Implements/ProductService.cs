using Capital.BL.DTOs.ProductDtos;
using Capital.BL.Services.Interfaces;
using Capital.BL.Utilities.Enums;

namespace Capital.BL.Services.Implements;

public class ProductService : IProductService
{
    public Task<ProductGetDto> CreateAsync(ProductCreateDto dto)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<ProductGetDto>> CreateBulkAsync(IEnumerable<ProductCreateDto> dtos)
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteAsync(int[] ids, EDeleteType dType)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<ProductGetDto>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<ProductGetDto> GetByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<ProductGetDto>> SortedAndFilteredProductsAsync()
    {
        throw new NotImplementedException();
    }

    public Task<ProductGetDto> UpdateAsync(int id, ProductUpdateDto dto)
    {
        throw new NotImplementedException();
    }
}

