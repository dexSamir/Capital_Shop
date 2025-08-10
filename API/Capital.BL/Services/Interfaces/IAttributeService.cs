using Capital.BL.DTOs.AttributeDtos;
using Capital.BL.DTOs.AttributeDtos.ProductAttributeValueDtos;

namespace Capital.BL.Services.Interfaces;

public interface IAttributeService
{
	// Attributes 
	Task<AttributeGetDto> CreateAttributeAsync(AttributeCreateDto dto);
	Task<AttributeGetDto> GetAttributeByIdAsync(int attributeId);
	Task<IEnumerable<AttributeGetDto>> GetAllAttributesAsync();
	Task<AttributeGetDto> UpdateAttributeAsync(AttributeUpdateDto dto, int attributeId);
	Task<bool> DeleteAttributeAsync(int id);

    // Attributes Values
    Task<AttributeValueGetDto> CreateAttributeValueAsync(AttributeValueCreateDto dto);
    Task<AttributeValueGetDto> GetAttributeValueByIdAsync(int id);
    Task<IEnumerable<AttributeValueGetDto>> GetValuesByAttributeIdAsync(int attributeId);
    Task<AttributeValueGetDto> UpdateAttributeValueAsync(int id, AttributeValueUpdateDto dto);
    Task<bool> DeleteAttributeValueAsync(int id);

    // Product Attribute Value
    Task AssignAttributeValueToProductAsync(AssignAttributeValueToProductDto dto);
    Task RemoveAttributeValueFromProductAsync(int productId, int attributeValueId);
    Task<IEnumerable<ProductAttributeValueGetDto>> GetProductAttributesAsync(int productId);

    Task AssignMultipleAttributeValuesToProductAsync(AssignMultipleAttributeValuesDto dto);
    Task RemoveAllAttributesFromProductAsync(int productId);
}

