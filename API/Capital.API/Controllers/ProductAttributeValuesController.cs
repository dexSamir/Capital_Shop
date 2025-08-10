using Capital.BL.DTOs.AttributeDtos.ProductAttributeValueDtos;
using Capital.BL.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Capital.API.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class ProductAttributeValuesController : ControllerBase
{
    readonly IAttributeService _service;
    public ProductAttributeValuesController(IAttributeService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> AssignAttributeValueToProduct(AssignAttributeValueToProductDto dto)
    {
        await _service.AssignAttributeValueToProductAsync(dto); 
        return Ok();
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> RemoveAttributeValueFromProduct(int productId, int attributeValueId)
    {
        await _service.RemoveAttributeValueFromProductAsync(productId, attributeValueId); 
        return Ok();
    }

    [HttpPost]
    public async Task<IActionResult> GetProductAttributes(int productId)
    {
        return Ok(await _service.GetProductAttributesAsync(productId));
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> AssignMultipleAttributeValuesToProduct(AssignMultipleAttributeValuesDto dto)
    {
        await _service.AssignMultipleAttributeValuesToProductAsync(dto); 
        return Ok();
    }

    [HttpDelete("{deleteType}")]
    public async Task<IActionResult> RemoveAllAttributesFromProduct(int productId)
    {
        await _service.RemoveAllAttributesFromProductAsync(productId); 
        return Ok();
    }
}
