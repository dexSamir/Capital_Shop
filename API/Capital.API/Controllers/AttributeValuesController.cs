using Capital.BL.DTOs.AttributeDtos;
using Capital.BL.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Capital.API.Controllers;

[Route("api/attribute/values/[action]")]
[ApiController]
public class AttributeValuesController : ControllerBase
{
    readonly IAttributeService _service;
    public AttributeValuesController(IAttributeService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetValuesByAttributeId(int id)
    {
        return Ok(await _service.GetValuesByAttributeIdAsync(id));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAttributeValueById(int id)
    {
        return Ok(await _service.GetAttributeValueByIdAsync(id));
    }

    [HttpPost]
    public async Task<IActionResult> CreateAttributeValue(AttributeValueCreateDto dto)
    {
        return Ok(await _service.CreateAttributeValueAsync(dto));
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateAttributeValue(int id, AttributeValueUpdateDto dto)
    {
        return Ok(await _service.UpdateAttributeValueAsync(id, dto));
    }

    [HttpDelete("{deleteType}")]
    public async Task<IActionResult> DeleteAttributeValue(int id)
    {
        return Ok(await _service.DeleteAttributeValueAsync(id));
    }
}
