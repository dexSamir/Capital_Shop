using Capital.BL.DTOs.ProductSpecificationDtos;
using Capital.BL.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Capital.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductSpecificationsController : ControllerBase
{
    readonly IProductSpecificationService _service;
    public ProductSpecificationsController(IProductSpecificationService service)
    {
        _service = service;
    }

    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetSpecificationsByProductId(int productId)
    {
        return Ok(await _service.GetByProductIdAsync(productId));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await _service.GetByIdAsync(id));
    }

    [HttpPost]
    public async Task<IActionResult> Create(ProductSpecificationCreateDto dto)
    {
        return Ok(await _service.CreateAsync(dto));
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(int id, ProductSpecificationUpdateDto dto)
    {
        return Ok(await _service.UpdateAsync(id, dto));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await _service.DeleteAsync(id));
    }

    [HttpDelete("product/{productId}")]
    public async Task<IActionResult> DeleteAllFromProducts(int id)
    {
        await _service.RemoveAllFromProductAsync(id); 
        return Ok();
    }
}
