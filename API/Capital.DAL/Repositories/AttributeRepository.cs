using Capital.Core.Repositories;
using Capital.DAL.Context;

namespace Capital.DAL.Repositories;

public class AttributeRepository : GenericRepository<Core.Entities.Attribute> , IAttributeRepository 
{
	public AttributeRepository(AppDbContext context) : base(context)
	{
	}
}

