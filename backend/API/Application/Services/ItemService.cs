using API.Application.Interfaces;
using API.Domain.Entities;

namespace API.Application.Services
{
    /// <summary>
    /// Business Logic Layer service for Item operations.
    /// Wraps the IItemRepository and can apply business rules before/after data access.
    /// </summary>
    public class ItemService : IItemService
    {
        private readonly IItemRepository _repository;

        public ItemService(IItemRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Item>> GetAllItemsAsync()
        {
            return await _repository.GetAllItemsAsync();
        }
    }
}
