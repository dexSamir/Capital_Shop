using Capital.BL.DTOs.CategoryDtos;
using Capital.BL.Services.Interfaces;
using Capital.BL.Utilities.Enums;
using Microsoft.AspNetCore.Mvc;

namespace Capital.API.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    readonly ICategoryService _service;
    public CategoriesController(ICategoryService service)
    {
        _service = service; 
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await _service.GetByIdAsync(id));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CategoryCreateDto dto)
    {
        return Ok(await _service.CreateAsync(dto)); 
    }

    [HttpPost]
    public async Task<IActionResult> CreateRange(IEnumerable<CategoryCreateDto> dtos)
    {
        return Ok(await _service.CreateBulkAsync(dtos));
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(int id, CategoryUpdateDto dto)
    {
        return Ok(await _service.UpdateAsync( id, dto));
    }

    [HttpDelete("{deleteType}")]
    public async Task<IActionResult> Delete([FromQuery] int[] ids, EDeleteType deleteType)
    {
        return Ok(await _service.DeleteAsync(ids, deleteType)); 
    }
}
