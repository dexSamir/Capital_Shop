using Capital.BL.DTOs.AttributeDtos;
using Capital.BL.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Capital.API.Controllers;

[Route("api/[controller]/[action]")]
[ApiController]
public class AttributesController : ControllerBase
{
    readonly IAttributeService _service;
    public AttributesController(IAttributeService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllAttributesAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await _service.GetAttributeByIdAsync(id));
    }

    [HttpPost]
    public async Task<IActionResult> Create(AttributeCreateDto dto)
    {
        return Ok(await _service.CreateAttributeAsync(dto));
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> Update(int id, AttributeUpdateDto dto)
    {
        return Ok(await _service.UpdateAttributeAsync(dto, id));
    }

    [HttpDelete("{deleteType}")]
    public async Task<IActionResult> Delete(int id)
    {
        return Ok(await _service.DeleteAttributeAsync(id));
    }
}
