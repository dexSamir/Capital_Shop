using Capital.BL.DTOs.ProductDtos;
using Capital.BL.DTOs.ProductImageDto;
using Capital.BL.Services.Interfaces;
using Capital.BL.Utilities.Enums;
using Microsoft.AspNetCore.Mvc;
namespace Capital.API.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class ProductImagesController : ControllerBase
{
    readonly IProductImageService _service;
    public ProductImagesController(IProductImageService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetImagesByProductId(int productId)
    {
        return Ok(await _service.GetImagesByProductIdAsync(productId));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int imageId)
    {
        return Ok(await _service.GetByIdAsync(imageId));
    }

    [HttpPost]
    public async Task<IActionResult> AddImages(int productId,[FromForm] IList<ProductImageCreateDto> dtos)
    {
        await _service.AddImagesAsync(productId, dtos);
        return Ok();
    }

    [HttpPost]
    public async Task<IActionResult> SetPrimaryImage(int productId, int imageId)
    {
        return Ok(await _service.SetPrimaryImageAsync(productId, imageId));
    }

    [HttpPost]
    public async Task<IActionResult> SetSecondaryImage(int productId, int imageId)
    {
        return Ok(await _service.SetSecondaryImageAsync(productId, imageId));
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateAltText(int imageId, string altText)
    {
        await _service.UpdateAltTextAsync(imageId, altText); 
        return Ok();
    }

    [HttpDelete("{deleteType}")]
    public async Task<IActionResult> Delete([FromQuery] int[] ids, EDeleteType deleteType)
    {
        await _service.DeleteImagesAsync(ids, deleteType);
        return Ok();
    }
}
