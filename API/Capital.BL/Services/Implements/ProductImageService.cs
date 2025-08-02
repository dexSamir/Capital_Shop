using Capital.BL.Constants;
using Capital.BL.DTOs.ProductImageDto;
using Capital.BL.Exceptions.Common;
using Capital.BL.ExternalServices.Interfaces;
using Capital.BL.OtherServices.Interfaces;
using Capital.BL.Services.Interfaces;
using Capital.BL.Utilities.Enums;
using Capital.Core.Entities;
using Capital.Core.Repositories;

namespace Capital.BL.Services.Implements;

public class ProductImageService : IProductImageService
{
    readonly IProductImageRepository _repo;
    readonly IProductRepository _productRepo;
    readonly IMapper _mapper;
    readonly IFileService _fileService;
    readonly ICacheService _cache; 
	public ProductImageService(IProductImageRepository repo, IMapper mapper, IFileService fileService, ICacheService cache, IProductRepository productRepo)
	{
        _cache = cache;
        _productRepo = productRepo; 
        _fileService = fileService; 
        _mapper = mapper;
        _repo = repo;
	}

    public async Task AddImagesAsync(int productId, IList<ProductImageCreateDto> dtos)
    {
        if (!await _productRepo.IsExistAsync(productId))
            throw new NotFoundException<Product>();

        var primaryDto = dtos.FirstOrDefault(x => x.IsPrimary);
        var secondaryDto = dtos.FirstOrDefault(x => x.IsSecondary);

        foreach (var dto in dtos)
        {
            dto.IsPrimary = dto == primaryDto;
            dto.IsSecondary = dto == secondaryDto;
        }

        List<ProductImage> images = new(); 

        for (int i = 0; i < dtos.Count; i++)
        {
            var data = _mapper.Map<ProductImage>(dtos[i]);
            data.ImageUrl = await _fileService.ProcessImageAsync(dtos[i].ImageUrl, "productImages", "image/", 15);
            data.CreatedTime = DateTime.UtcNow;
            images.Add(data);
        }

        await _repo.AddRangeAsync(images);
        await _repo.SaveAsync();
        await _cache.RemoveAsync(CacheKeys.Product.ImagesById(productId)); 
    }

    public Task DeleteAllByProductIdAsync(int productId, EDeleteType dType)
    {
        throw new NotImplementedException();
    }

    public Task DeleteImagesAsync(int[] imageId, EDeleteType dType)
    {
        throw new NotImplementedException();
    }

    public Task<ProductImageGetDto?> GetByIdAsync(int imageId)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<ProductImageGetDto>> GetImagesByProductIdAsync(int productId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> SetPrimaryImageAsync(int productId, int imageId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> SetSecondaryImageAsync(int productId, int imageId)
    {
        throw new NotImplementedException();
    }

    public Task UpdateAltTextAsync(int imageId, string altText)
    {
        throw new NotImplementedException();
    }
}

