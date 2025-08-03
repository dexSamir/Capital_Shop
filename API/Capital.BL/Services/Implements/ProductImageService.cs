using System.ComponentModel.DataAnnotations;
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

        MarkPrimaryAndSecondary(dtos);

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

    public async Task<ProductImageGetDto?> GetByIdAsync(int imageId)
    {
        var image = await _repo.GetByIdAsync(imageId) ?? throw new NotFoundException<ProductImage>();
        return _mapper.Map<ProductImageGetDto>(image); 
    }

    public async Task<IEnumerable<ProductImageGetDto>> GetImagesByProductIdAsync(int productId)
    {
        return await _cache.GetOrSetAsync(CacheKeys.Product.ImagesById(productId), async () =>
        {
            var images = await _repo.GetWhereAsync(x => x.ProductId == productId);
            return _mapper.Map<IEnumerable<ProductImageGetDto>>(images); 
        }, TimeSpan.FromMinutes(2));
    }


    public async Task<bool> SetPrimaryImageAsync(int productId, int imageId)
       => await SetImageAsync(productId, imageId, true);

    public async Task<bool> SetSecondaryImageAsync(int productId, int imageId)
       => await SetImageAsync(productId, imageId, false); 

    public async Task UpdateAltTextAsync(int imageId, string altText)
    {
        var image = await _repo.GetByIdAsync(imageId)
                  ?? throw new NotFoundException<ProductImage>();

        image.AltText = altText;
        await _repo.SaveAsync();
        image.UpdatedTime = DateTime.UtcNow;

        await _cache.RemoveAsync(CacheKeys.Product.ImagesById(image.ProductId));
    }

    public async Task DeleteImagesAsync(int[] imageId, EDeleteType dType)
    {
        if (dType == EDeleteType.Hard)
            foreach (var id in imageId)
            {
                var data = await _repo.GetByIdAsync(id, false) ?? throw new NotFoundException<Product>();

                if (!string.IsNullOrEmpty(data.ImageUrl))
                    await _fileService.DeleteImageIfNotDefault(data.ImageUrl, "ProductImages");
            }

        switch (dType)
        {
            case EDeleteType.Soft:
                await _repo.SoftDeleteRangeAsync(imageId);
                break;

            case EDeleteType.Reverse:
                await _repo.ReverseDeleteRangeAsync(imageId);
                break;

            case EDeleteType.Hard:
                await _repo.HardDeleteRangeAsync(imageId);
                break;

            default:
                throw new UnsupportedDeleteTypeException();
        }
        
        await _repo.SaveAsync();
    }
    

    // private methodlar
    private void MarkPrimaryAndSecondary(IList<ProductImageCreateDto> dtos)
    {
        if (dtos.Count(x => x.IsPrimary) > 1 || dtos.Count(x => x.IsSecondary) > 1)
            throw new ValidationException("Only one image can be primary.");

        if (dtos.Any(x => x.IsPrimary && x.IsSecondary))
            throw new ValidationException("An image cannot be both primary and secondary.");

        var primary = dtos.FirstOrDefault(x => x.IsPrimary);
        var secondary = dtos.FirstOrDefault(x => x.IsSecondary);
        foreach (var dto in dtos)
        {
            dto.IsPrimary = dto == primary;
            dto.IsSecondary = dto == secondary;
        }
    }

    private async Task<bool> SetImageAsync(int productId, int imageId, bool isPrimary)
    {
        var product = await _productRepo.GetByIdAsync(productId, "Images")
                  ?? throw new NotFoundException<Product>();

        var image = product.Images.FirstOrDefault(x => x.Id == imageId)
                    ?? throw new NotFoundException<ProductImage>();

        foreach (var img in product.Images)
        {
            if (isPrimary)
                img.IsPrimary = false;
            else
                img.IsSecondary = false;
        }

        if (isPrimary)
            image.IsPrimary = true;
        else
            image.IsSecondary = true;

        await _productRepo.SaveAsync();
        image.UpdatedTime = DateTime.UtcNow;

        await _cache.RemoveAsync(CacheKeys.Product.ImagesById(productId));
        return true;
    }
}

