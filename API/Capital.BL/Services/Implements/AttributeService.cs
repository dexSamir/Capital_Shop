using Capital.BL.DTOs.AttributeDtos;
using Capital.BL.DTOs.AttributeDtos.ProductAttributeValueDtos;
using Capital.BL.Exceptions.Common;
using Capital.BL.Services.Interfaces;
using Capital.Core.Entities;
using Capital.Core.Entities.Relational;
using Capital.Core.Repositories;
using Attribute = Capital.Core.Entities.Attribute;

namespace Capital.BL.Services.Implements;

public class AttributeService : IAttributeService
{
    readonly IAttributeRepository _repo;
    readonly IMapper _mapper;
    readonly IAttributeValueRepository _valueRepo;
    readonly IProductAttributeValueRepository _prodValueRepo; 
    public AttributeService(IAttributeRepository repo, IMapper mapper, IAttributeValueRepository valueRepo, IProductAttributeValueRepository prodValueRepo)
    {
        _prodValueRepo = prodValueRepo; 
        _valueRepo = valueRepo; 
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

    public async Task<AttributeGetDto> UpdateAttributeAsync(AttributeUpdateDto dto, int attributeId)
    {
        var data = await _repo.GetByIdAsync(attributeId, false, "AttributeValue") ?? throw new NotFoundException<Attribute>();
        _mapper.Map(dto, data);
        data.UpdatedTime = DateTime.UtcNow;

        _repo.UpdateAsync(data);
        await _repo.SaveAsync();
        return _mapper.Map<AttributeGetDto>(data); 
    }

    public async Task<bool> DeleteAttributeAsync(int id)
    {
       if (!await _repo.IsExistAsync(id))
            throw new NotFoundException<Attribute>();

        await _repo.HardDeleteAsync(id);
        bool success = await _repo.SaveAsync() > 0 ? true : false;
        return success; 
    }

    // Attribute Value 
    public async Task<IEnumerable<AttributeValueGetDto>> GetValuesByAttributeIdAsync(int attributeId)
    {
        var data = await _valueRepo.GetWhereAsync(x => x.AttributeId == attributeId);
        if (data is null)
            throw new NotFoundException<Attribute>();

        return _mapper.Map<IEnumerable<AttributeValueGetDto>>(data); 
    }

    public async Task<AttributeValueGetDto> GetAttributeValueByIdAsync(int id)
    {
        var data = await _valueRepo.GetByIdAsync(id, "Attribute") ?? throw new NotFoundException<AttributeValue>("Attribute value is not found!");
        return _mapper.Map<AttributeValueGetDto>(data); 
    }

    public async Task<AttributeValueGetDto> CreateAttributeValueAsync(AttributeValueCreateDto dto)
    {
        var data = _mapper.Map<AttributeValue>(dto);
        data.CreatedTime = DateTime.UtcNow;
        await _valueRepo.AddAsync(data);
        await _valueRepo.SaveAsync();

        return _mapper.Map<AttributeValueGetDto>(data); 
    }

    public async Task<bool> DeleteAttributeValueAsync(int id)
    {
        if (!await _repo.IsExistAsync(id))
            throw new NotFoundException<Attribute>();

        await _repo.HardDeleteAsync(id);
        bool success = await _repo.SaveAsync() > 0 ? true : false;
        return success;
    }

    public async Task<AttributeValueGetDto> UpdateAttributeValueAsync(int id, AttributeValueUpdateDto dto)
    {
        var data = await _valueRepo.GetByIdAsync(id, false, "Attribute") ?? throw new NotFoundException<AttributeValue>();
        _mapper.Map(dto, data);
        data.UpdatedTime = DateTime.UtcNow;

        _valueRepo.UpdateAsync(data);
        await _repo.SaveAsync();
        return _mapper.Map<AttributeValueGetDto>(data);
    }


    //Product Attribute Value 
    public async Task<IEnumerable<ProductAttributeValueGetDto>> GetProductAttributesAsync(int productId)
    {
        var data = await _prodValueRepo.GetWhereAsync(x => x.ProductId == productId);
        return _mapper.Map<IEnumerable<ProductAttributeValueGetDto>>(data); 
    }

    public async Task RemoveAllAttributesFromProductAsync(int productId)
    {
        var items = await _prodValueRepo.GetWhereAsync(x => x.ProductId == productId, false);
        if (!items.Any())
            return;

        _prodValueRepo.HardDeleteRange(items);
        await _prodValueRepo.SaveAsync();
    }

    public async Task RemoveAttributeValueFromProductAsync(int productId, int attributeValueId)
    {
        var entity = await _prodValueRepo.GetFirstAsync(x => x.ProductId == productId && x.AttributeValueId == attributeValueId, false);
        if (entity is null)
            throw new NotFoundException<ProductAttributeValue>();

        _prodValueRepo.HardDelete(entity);
        await _prodValueRepo.SaveAsync();
    }

    public async Task AssignAttributeValueToProductAsync(AssignAttributeValueToProductDto dto)
    {
        bool exists = await _prodValueRepo.IsExistAsync(x =>
            x.ProductId == dto.ProductId &&
            x.AttributeValueId == dto.AttributeValueId);

        if (exists)
            throw new AlreadyExistsException<ProductAttributeValue>();

        var pav = new ProductAttributeValue
        {
            ProductId = dto.ProductId,
            AttributeValueId = dto.AttributeValueId
        };

        await _prodValueRepo.AddAsync(pav);
        await _prodValueRepo.SaveAsync();
    }

    public async Task AssignMultipleAttributeValuesToProductAsync(AssignMultipleAttributeValuesDto dto)
    {
        var newList = new List<ProductAttributeValue>();

        foreach (var valueId in dto.AttributeValueIds.Distinct())
        {
            bool exists = await _prodValueRepo.IsExistAsync(x =>
                x.ProductId == dto.ProductId &&
                x.AttributeValueId == valueId);

            if (!exists)
            {
                newList.Add(new ProductAttributeValue
                {
                    ProductId = dto.ProductId,
                    AttributeValueId = valueId
                });
            }
        }

        if (newList.Any())
        {
            await _prodValueRepo.AddRangeAsync(newList);
            await _prodValueRepo.SaveAsync();
        }
    }

}

