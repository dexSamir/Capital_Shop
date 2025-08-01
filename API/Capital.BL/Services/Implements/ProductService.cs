using Capital.BL.Constants;
using Capital.BL.DTOs.ProductDtos;
using Capital.BL.ExternalServices.Interfaces;
using Capital.BL.OtherServices.Interfaces;
using Capital.BL.Services.Interfaces;
using Capital.BL.Utilities.Enums;
using Capital.Core.Repositories;

namespace Capital.BL.Services.Implements;

public class ProductService : IProductService
{
    readonly IProductRepository _repo;
    readonly IFileService _fileService;
    readonly IMapper _mapper;
    readonly ICacheService _cache; 
    public ProductService(IProductRepository repo, IFileService fileService, IMapper mapper, ICacheService cache)
    {
        _mapper = mapper;
        _cache = cache; 
        _fileService = fileService; 
        _repo = repo; 
    }

    public async Task<IEnumerable<ProductGetDto>> GetAllAsync(ProductFilterDto dto)
    {

    }

    public Task<ProductDetailDto> GetByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

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

    public Task<IEnumerable<ProductGetDto>> SortedAndFilteredProductsAsync(ProductFilterDto dto)
    {
        throw new NotImplementedException();
    }

    public Task<ProductGetDto> UpdateAsync(int id, ProductUpdateDto dto)
    {
        throw new NotImplementedException();
    }
}

