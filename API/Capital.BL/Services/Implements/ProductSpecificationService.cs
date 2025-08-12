using Capital.BL.DTOs.ProductSpecificationDtos;
using Capital.BL.Exceptions.Common;
using Capital.BL.Services.Interfaces;
using Capital.Core.Entities;
using Capital.Core.Repositories;

namespace Capital.BL.Services.Implements;

public class ProductSpecificationService : IProductSpecificationService
{
    readonly IProductSpecificationRepository _repo;
    readonly IMapper _mapper; 
    public ProductSpecificationService(IProductSpecificationRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductSpecificationGetDto>> GetByProductIdAsync(int productId)
    {
        var data = await _repo.GetWhereAsync(x => x.ProductId == productId, "Product");
        return _mapper.Map<IEnumerable<ProductSpecificationGetDto>>(data);
    }

    public async Task<ProductSpecificationGetDto> GetByIdAsync(int id)
    {
        var data = await _repo.GetByIdAsync(id, "Product") ?? throw new NotFoundException<ProductSpecification>("Product Specification is not found!");
        return _mapper.Map<ProductSpecificationGetDto>(data);
    }

    public async Task<ProductSpecificationGetDto> CreateAsync(ProductSpecificationCreateDto dto)
    {
        var data = _mapper.Map<ProductSpecification>(dto);
        data.CreatedTime = DateTime.UtcNow;
        await _repo.AddAsync(data);
        await _repo.SaveAsync();
        return _mapper.Map<ProductSpecificationGetDto>(data); 
    }

    public async Task<bool> DeleteAsync(int id)
    {
        if(!await _repo.IsExistAsync(id))
            throw new NotFoundException<ProductSpecification>("Product Specification is not found!");

        return await _repo.DeleteAndSaveAsync(id) > 0 ? true : false;
    }

    

    public async Task RemoveAllFromProductAsync(int productId)
    {
        var data = await _repo.GetWhereAsync(x => x.ProductId == productId, false, "Product");
        _repo.HardDeleteRange(data);

        await _repo.SaveAsync(); 
    }

    public async Task<ProductSpecificationGetDto> UpdateAsync(int id, ProductSpecificationUpdateDto dto)
    {
        var data = await _repo.GetByIdAsync(id, "Product") ?? throw new NotFoundException<ProductSpecification>("Product Specification is not found!");

        _mapper.Map(dto, data);
        data.isUpdated = true;
        data.UpdatedTime = DateTime.UtcNow;

        _repo.UpdateAsync(data); 
        await _repo.SaveAsync();

        return _mapper.Map<ProductSpecificationGetDto>(data); 
    }
}

