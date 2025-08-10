using Capital.BL.DTOs.AttributeDtos;
using Capital.BL.DTOs.AttributeDtos.ProductAttributeValueDtos;
using Capital.BL.Exceptions.Common;
using Capital.BL.Services.Interfaces;
using Capital.BL.Utilities.Enums;
using Capital.Core.Repositories;
using Attribute = Capital.Core.Entities.Attribute;

namespace Capital.BL.Services.Implements;

public class AttributeService : IAttributeService
{
    readonly IAttributeRepository _repo;
    readonly IMapper _mapper;
    public AttributeService(IAttributeRepository repo, IMapper mapper)
    {
        _mapper = mapper; 
        _repo = repo; 
    }

    // Attributes
    public async Task<IEnumerable<AttributeGetDto>> GetAllAttributesAsync()
    {
        return _mapper.Map<IEnumerable<AttributeGetDto>>(await _repo.GetAllAsync("AttributeValue")); 
    }

    public async Task<AttributeGetDto> GetAttributeByIdAsync(int attributeId)
    {
        var data = await _repo.GetByIdAsync(attributeId, "AttributeValue") ?? throw new NotFoundException<Attribute>();
        return _mapper.Map<AttributeGetDto>(data);
    }

    public async Task<AttributeGetDto> CreateAttributeAsync(AttributeCreateDto dto)
    {
        var data = _mapper.Map<Attribute>(dto);
        if (data is null)
            throw new NotFoundException<Attribute>();

        data.CreatedTime = DateTime.UtcNow;
        await _repo.AddAsync(data);
        await _repo.SaveAsync();

        return _mapper.Map<AttributeGetDto>(data); 
    }

    public async Task<AttributeGetDto> UpdateAttributeDto(AttributeUpdateDto dto, int attributeId)
    {
        var data = await _repo.GetByIdAsync(attributeId, "AttributeValue") ?? throw new NotFoundException<Attribute>();
        _mapper.Map(dto, data);
        data.UpdatedTime = DateTime.UtcNow;

        _repo.UpdateAsync(data);
        await _repo.SaveAsync();
        return _mapper.Map<AttributeGetDto>(data); 
    }

    public Task<bool> DeleteAttributeAsync(int id, EDeleteType dtype = EDeleteType.Hard)
    {
        throw new NotImplementedException();
    }




    public Task AssignAttributeValueToProductAsync(AssignAttributeValueToProductDto dto)
    {
        throw new NotImplementedException();
    }

    public Task AssignMultipleAttributeValuesToProductAsync(AssignMultipleAttributeValuesDto dto)
    {
        throw new NotImplementedException();
    }

   

    public Task<AttributeValueGetDto> CreateAttributeValueAsync(AttributeValueCreateDto dto)
    {
        throw new NotImplementedException();
    }


    public Task<bool> DeleteAttributeValueAsync(int id)
    {
        throw new NotImplementedException();
    }


    

    public Task<AttributeValueGetDto> GetAttributeValueByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<ProductAttributeValueGetDto>> GetProductAttributesAsync(int productId)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<AttributeValueGetDto>> GetValuesByAttributeIdAsync(int attributeId)
    {
        throw new NotImplementedException();
    }

    public Task RemoveAllAttributesFromProductAsync(int productId)
    {
        throw new NotImplementedException();
    }

    public Task RemoveAttributeValueFromProductAsync(int productId, int attributeValueId)
    {
        throw new NotImplementedException();
    }


   

    public Task<AttributeValueGetDto> UpdateAttributeValueAsync(int id, AttributeValueUpdateDto dto)
    {
        throw new NotImplementedException();
    }
}

