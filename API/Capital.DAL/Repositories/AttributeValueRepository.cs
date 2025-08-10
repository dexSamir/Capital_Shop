using Capital.Core.Entities;
using Capital.Core.Repositories;
using Capital.DAL.Context;

namespace Capital.DAL.Repositories;

public class AttributeValueRepository : GenericRepository<AttributeValue> , IAttributeValueRepository 
{
	public AttributeValueRepository(AppDbContext context) : base(context)
	{
	}
}

