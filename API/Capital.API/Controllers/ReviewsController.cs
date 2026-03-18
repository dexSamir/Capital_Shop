using Capital.BL.DTOs.ReviewDtos;
using Capital.BL.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Capital.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetByProduct(int productId)
    {
        var reviews = await _reviewService.GetByProductIdAsync(productId);
        return Ok(reviews);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromForm] ReviewCreateDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var review = await _reviewService.CreateAsync(dto, userId);
        return Ok(review);
    }

    [HttpPut("{id}/like")]
    public async Task<IActionResult> Like(int id)
    {
        await _reviewService.LikeAsync(id);
        return Ok();
    }

    [HttpPut("{id}/dislike")]
    public async Task<IActionResult> Dislike(int id)
    {
        await _reviewService.DislikeAsync(id);
        return Ok();
    }
}
