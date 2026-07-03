using API.Domain.Entities;

namespace API.Application.Interfaces
{
    public interface IItemService
    {
        Task<IEnumerable<Item>> GetAllItemsAsync();
    }
}
