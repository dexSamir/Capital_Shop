using Capital.BL.DTOs.CartDtos;
using Capital.BL.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Capital.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var cart = await _cartService.GetOrCreateAsync();
        return Ok(cart);
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddOrUpdateItem(CartItemUpdateDto dto)
    {
        var cart = await _cartService.AddOrUpdateItemAsync(dto);
        return Ok(cart);
    }

    [HttpDelete("items/{productId}")]
    public async Task<IActionResult> RemoveItem(int productId)
    {
        var cart = await _cartService.RemoveItemAsync(productId);
        return Ok(cart);
    }

    [HttpDelete]
    public async Task<IActionResult> Clear()
    {
        await _cartService.ClearAsync();
        return NoContent();
    }
}

