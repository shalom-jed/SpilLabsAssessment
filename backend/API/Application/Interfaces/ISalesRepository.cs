using API.Domain.Entities;

namespace API.Application.Interfaces
{
    public interface ISalesOrderRepository
    {
        Task<IEnumerable<SalesOrder>> GetAllOrdersAsync();
        Task<SalesOrder?> GetOrderByIdAsync(int id);
        Task<SalesOrder> CreateOrderAsync(SalesOrder order);
        Task<SalesOrder> UpdateOrderAsync(SalesOrder order);
    }
}