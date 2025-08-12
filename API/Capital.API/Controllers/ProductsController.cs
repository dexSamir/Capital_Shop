using Capital.BL.DTOs.ProductDtos;
using Capital.BL.Services.Interfaces;
using Capital.BL.Utilities.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Capital.API.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class ProductsController : ControllerBase
{
    readonly IProductService _service;
    public ProductsController(IProductService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAsync([FromQuery] ProductFilterDto dto)
    {
        return Ok(await _service.GetAllAsync(dto));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await _service.GetByIdAsync(id));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] ProductCreateDto dto)
    {
        return Ok(await _service.CreateAsync(dto)); 
    }

    [HttpPost]
    public async Task<IActionResult> CreateRange(IEnumerable<ProductCreateDto> dtos)
    {
        return Ok(await _service.CreateBulkAsync(dtos));
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(int id, ProductUpdateDto dto)
    {
        return Ok(await _service.UpdateAsync(id, dto));
    }

    [HttpDelete("{deleteType}")]
    public async Task<IActionResult> Delete([FromQuery] int[] ids, EDeleteType deleteType)
    {
        return Ok(await _service.DeleteAsync(ids, deleteType));
    }
}
