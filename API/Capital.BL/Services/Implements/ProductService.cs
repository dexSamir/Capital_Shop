using System.Linq.Expressions;
using Capital.BL.DTOs.ProductDtos;
using Capital.BL.Exceptions.Common;
using Capital.BL.ExternalServices.Interfaces;
using Capital.BL.OtherServices.Interfaces;
using Capital.BL.Services.Interfaces;
using Capital.BL.Utilities.Enums;
using Capital.Core.Entities;
using Capital.Core.Repositories;
using Microsoft.AspNetCore.Http;

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
        Expression<Func<Product, bool>> filter = x =>
         !x.isDeleted &&
         (!dto.MinPrice.HasValue || x.SellPrice >= dto.MinPrice.Value) &&
         (!dto.MaxPrice.HasValue || x.SellPrice <= dto.MaxPrice.Value) &&
         (!dto.CategoryId.HasValue || x.CategoryId == dto.CategoryId.Value) &&
         (!dto.BrandId.HasValue || x.BrandId == dto.BrandId.Value) &&
         (string.IsNullOrEmpty(dto.Search) || x.Title.ToLower().Contains(dto.Search.ToLower()));

        Func<IQueryable<Product>, IOrderedQueryable<Product>>? orderBy = dto.SortDirection switch
        {
            ESortDirection.ASC => q => q.OrderBy(x => x.SellPrice),
            ESortDirection.DESC => q => q.OrderByDescending(x => x.SellPrice),
            _ => null
        };

        var products = await _repo.GetPagedAsync(
        filter,
        orderBy,
        dto.Page,
        dto.PageSize,
        true,
        "Brand", "Categories"
    );
        return _mapper.Map<IEnumerable<ProductGetDto>>(products);
    }

    public async Task<ProductDetailDto> GetByIdAsync(int id)
    {
        if (!await _repo.IsExistAsync(id))
            throw new NotFoundException<Product>();

        var data = await _repo.GetByIdAsync(id, "brand" , "categories");
        return _mapper.Map<ProductDetailDto>(data); 
    }

    public async Task<ProductGetDto> CreateAsync(ProductCreateDto dto)
    {
        var data = _mapper.Map<Product>(dto);
        data.CreatedTime = DateTime.UtcNow;

        data.CoverImage = await setImage( dto.CoverImage, "products", "image/", 15);
        data.SecondImage = await setImage( dto.SecondImage, "products", "image/", 15);

        await _repo.AddAsync(data);
        await _repo.SaveAsync();
        return _mapper.Map<ProductGetDto>(data); 
    }

    public async Task<IEnumerable<ProductGetDto>> CreateBulkAsync(IEnumerable<ProductCreateDto> dtos)
    {
        var dtoList = dtos.ToList();
        var data = _mapper.Map<IList<Product>>(dtoList);

        for (int i = 0; i < data.Count; i++)
        {
            data[i].CreatedTime = DateTime.UtcNow;

            data[i].CoverImage = await setImage(dtos.ElementAt(i).CoverImage, "products", "image/", 15);
            data[i].SecondImage =await setImage( dtos.ElementAt(i).SecondImage, "products", "image/", 15);
        }

        await _repo.AddRangeAsync(data);
        await _repo.SaveAsync();
        return _mapper.Map<IEnumerable<ProductGetDto>>(data);
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

    private async Task<string> setImage(IFormFile file, string folder, string fileType, int size, string? existingImage = null)
    {
        if (file != null)
            return await _fileService.ProcessImageAsync(file, folder, fileType, size, existingImage);
        return existingImage;
    }

}

