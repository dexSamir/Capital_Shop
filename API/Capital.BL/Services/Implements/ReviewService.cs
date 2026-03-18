using AutoMapper;
using Capital.BL.DTOs.ReviewDtos;
using Capital.BL.Exceptions.Common;
using Capital.BL.Services.Interfaces;
using Capital.Core.Entities;
using Capital.Core.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Capital.BL.Services.Implements;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepo;
    private readonly IMapper _mapper;
    private readonly IProductRepository _productRepo;
    private readonly Microsoft.AspNetCore.Hosting.IWebHostEnvironment _env;

    public ReviewService(IReviewRepository reviewRepo, IMapper mapper, IProductRepository productRepo, Microsoft.AspNetCore.Hosting.IWebHostEnvironment env)
    {
        _reviewRepo = reviewRepo;
        _mapper = mapper;
        _productRepo = productRepo;
        _env = env;
    }

    public async Task<IEnumerable<ReviewGetDto>> GetByProductIdAsync(int productId)
    {
        var reviews = await _reviewRepo.GetWhereAsync(r => r.ProductId == productId, "User", "Rating", "Images");

        return _mapper.Map<IEnumerable<ReviewGetDto>>(reviews);
    }

    public async Task<ReviewGetDto> CreateAsync(ReviewCreateDto dto, string userId)
    {
        if (!await _productRepo.IsExistAsync(dto.ProductId))
            throw new NotFoundException<Product>();

        var review = _mapper.Map<Review>(dto);
        review.UserId = userId;
        review.CreatedTime = DateTime.UtcNow;
        review.IsAproved = true; 

        if (dto.Rating > 0 && dto.Rating <= 5)
        {
            review.Rating = new ProductRating
            {
                ProductId = dto.ProductId,
                Rating = dto.Rating,
                UserId = userId,
                CreatedTime = DateTime.UtcNow
            };
        }

        if (dto.Images != null && dto.Images.Any())
        {
            var imagesList = new List<ProductImage>();
            foreach (var img in dto.Images)
            {
                if (!Capital.BL.Extensions.FileExtension.IsValidType(img, "image")) continue;
                string fileName = await Capital.BL.Extensions.FileExtension.UploadAysnc(img, _env.WebRootPath, "Images", "Reviews");
                imagesList.Add(new ProductImage
                {
                    ImageUrl = $"Images/Reviews/{fileName}",
                    ProductId = dto.ProductId
                });
            }
            review.Images = imagesList;
        }

        await _reviewRepo.AddAsync(review);
        await _reviewRepo.SaveAsync();

        // Fetch again to get the User navigation property
        var savedReview = await _reviewRepo.GetFirstAsync(r => r.Id == review.Id, "User", "Rating", "Images");

        return _mapper.Map<ReviewGetDto>(savedReview);
    }

    public async Task LikeAsync(int id)
    {
        var review = await _reviewRepo.GetByIdAsync(id) ?? throw new NotFoundException<Review>();
        review.Likes++;
        _reviewRepo.UpdateAsync(review);
        await _reviewRepo.SaveAsync();
    }

    public async Task DislikeAsync(int id)
    {
        var review = await _reviewRepo.GetByIdAsync(id) ?? throw new NotFoundException<Review>();
        review.Dislikes++;
        _reviewRepo.UpdateAsync(review);
        await _reviewRepo.SaveAsync();
    }
}
