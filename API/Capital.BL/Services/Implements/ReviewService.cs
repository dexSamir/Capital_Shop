using AutoMapper;
using Capital.BL.DTOs.ReviewDtos;
using Capital.BL.Exceptions.Common;
using Capital.BL.Services.Interfaces;
using Capital.Core.Entities;
using Capital.Core.Repositories;
using Capital.DAL.Context;
using Microsoft.EntityFrameworkCore;

namespace Capital.BL.Services.Implements;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepo;
    private readonly IMapper _mapper;
    private readonly IProductRepository _productRepo;
    private readonly Microsoft.AspNetCore.Hosting.IWebHostEnvironment _env;
    private readonly AppDbContext _context;

    public ReviewService(IReviewRepository reviewRepo, IMapper mapper, IProductRepository productRepo, Microsoft.AspNetCore.Hosting.IWebHostEnvironment env, AppDbContext context)
    {
        _reviewRepo = reviewRepo;
        _mapper = mapper;
        _productRepo = productRepo;
        _env = env;
        _context = context;
    }

    public async Task<IEnumerable<ReviewGetDto>> GetByProductIdAsync(int productId, string? userId = null)
    {
        var reviews = await _reviewRepo.GetWhereAsync(r => r.ProductId == productId, "User", "Rating", "Images");
        var dtos = _mapper.Map<IEnumerable<ReviewGetDto>>(reviews).ToList();

        if (userId != null)
        {
            var userReactions = await _context.ReviewReactions
                .Where(r => r.UserId == userId && dtos.Select(d => d.Id).Contains(r.ReviewId))
                .ToListAsync();

            foreach (var dto in dtos)
            {
                var reaction = userReactions.FirstOrDefault(r => r.ReviewId == dto.Id);
                if (reaction != null)
                {
                    dto.UserReaction = reaction.ReactionType.ToString();
                }
            }
        }

        return dtos;
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
            var rootPath = _env.WebRootPath;
            if (string.IsNullOrWhiteSpace(rootPath))
            {
                rootPath = Path.Combine(_env.ContentRootPath, "wwwroot");
            }

            foreach (var img in dto.Images)
            {
                if (!Capital.BL.Extensions.FileExtension.IsValidType(img, "image")) continue;
                string fileName = await Capital.BL.Extensions.FileExtension.UploadAysnc(img, rootPath, "Images", "Reviews");
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

    public async Task LikeAsync(int id, string userId)
    {
        var review = await _reviewRepo.GetByIdAsync(id) ?? throw new NotFoundException<Review>();
        var existingReaction = await _context.ReviewReactions.FirstOrDefaultAsync(r => r.ReviewId == id && r.UserId == userId);

        if (existingReaction != null)
        {
            if (existingReaction.ReactionType == EReactionType.Like)
            {
                // Withdraw like
                review.Likes--;
                _context.ReviewReactions.Remove(existingReaction);
            }
            else
            {
                // Switch from dislike to like
                review.Dislikes--;
                review.Likes++;
                existingReaction.ReactionType = EReactionType.Like;
            }
        }
        else
        {
            // New like
            review.Likes++;
            await _context.ReviewReactions.AddAsync(new ReviewReaction { ReviewId = id, UserId = userId, ReactionType = EReactionType.Like });
        }

        _reviewRepo.UpdateAsync(review);
        await _context.SaveChangesAsync();
    }

    public async Task DislikeAsync(int id, string userId)
    {
        var review = await _reviewRepo.GetByIdAsync(id) ?? throw new NotFoundException<Review>();
        var existingReaction = await _context.ReviewReactions.FirstOrDefaultAsync(r => r.ReviewId == id && r.UserId == userId);

        if (existingReaction != null)
        {
            if (existingReaction.ReactionType == EReactionType.Dislike)
            {
                // Withdraw dislike
                review.Dislikes--;
                _context.ReviewReactions.Remove(existingReaction);
            }
            else
            {
                // Switch from like to dislike
                review.Likes--;
                review.Dislikes++;
                existingReaction.ReactionType = EReactionType.Dislike;
            }
        }
        else
        {
            // New dislike
            review.Dislikes++;
            await _context.ReviewReactions.AddAsync(new ReviewReaction { ReviewId = id, UserId = userId, ReactionType = EReactionType.Dislike });
        }

        _reviewRepo.UpdateAsync(review);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id, string userId, bool isAdmin)
    {
        var review = await _reviewRepo.GetByIdAsync(id) ?? throw new NotFoundException<Review>();
        if (review.UserId != userId && !isAdmin)
            throw new UnauthorizedAccessException("You are not allowed to delete this review.");

        // Optionally remove related reactions, images, and ratings
        var reactions = await _context.ReviewReactions.Where(r => r.ReviewId == id).ToListAsync();
        if (reactions.Any()) _context.ReviewReactions.RemoveRange(reactions);

        _reviewRepo.HardDelete(review);
        await _context.SaveChangesAsync();
    }

    public async Task<ReviewGetDto> UpdateAsync(int id, ReviewUpdateDto dto, string userId)
    {
        var review = await _reviewRepo.GetFirstAsync(r => r.Id == id, "User", "Rating", "Images") ?? throw new NotFoundException<Review>();
        if (review.UserId != userId)
            throw new UnauthorizedAccessException("You are not allowed to edit this review.");

        review.Comment = dto.Comment;
        if (dto.Rating.HasValue && dto.Rating > 0 && dto.Rating <= 5 && review.Rating != null)
        {
            review.Rating.Rating = dto.Rating.Value;
        }

        _reviewRepo.UpdateAsync(review);
        await _context.SaveChangesAsync();
        return _mapper.Map<ReviewGetDto>(review);
    }
}
