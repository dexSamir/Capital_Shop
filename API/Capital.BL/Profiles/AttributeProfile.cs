using Capital.BL.DTOs.AttributeDtos;
using Capital.BL.DTOs.AttributeDtos.ProductAttributeValueDtos;
using Capital.Core.Entities;
using Capital.Core.Entities.Relational;
using Attribute = Capital.Core.Entities.Attribute;

namespace Capital.BL.Profiles;

public class AttributeProfile : Profile
{
	public AttributeProfile()
	{
		CreateMap<Attribute, AttributeGetDto>();
		CreateMap<AttributeCreateDto, Attribute>(); 
		CreateMap<AttributeUpdateDto, Attribute>()
            .ForAllMembers(opt =>
        opt.Condition((src, dest, srcMember) => srcMember != null));

        CreateMap<AttributeValue, AttributeValueGetDto>();
        CreateMap<AttributeValueCreateDto, AttributeValue>();
        CreateMap<AttributeValueUpdateDto, AttributeValue>()
            .ForAllMembers(opt =>
        opt.Condition((src, dest, srcMember) => srcMember != null));


        CreateMap<ProductAttributeValue, ProductAttributeValueGetDto>();
        CreateMap<AssignAttributeValueToProductDto, ProductAttributeValue>();
        CreateMap<AssignMultipleAttributeValuesDto, ProductAttributeValue>(); 


    }
}

