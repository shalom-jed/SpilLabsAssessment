using API.Application.Interfaces;
using API.Domain.Entities;

namespace API.Application.Services
{
    /// <summary>
    /// Business Logic Layer service for SalesOrder operations.
    /// Handles business rules such as recalculating totals before persisting.
    /// </summary>
    public class SalesOrderService : ISalesOrderService
    {
        private readonly ISalesOrderRepository _repository;

        public SalesOrderService(ISalesOrderRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<SalesOrder>> GetAllOrdersAsync()
        {
            return await _repository.GetAllOrdersAsync();
        }

        public async Task<SalesOrder?> GetOrderByIdAsync(int id)
        {
            return await _repository.GetOrderByIdAsync(id);
        }

        public async Task<SalesOrder> CreateOrderAsync(SalesOrder order)
        {
            // Business Rule: Recalculate totals from line items before saving
            RecalculateTotals(order);
            return await _repository.CreateOrderAsync(order);
        }

        public async Task<SalesOrder> UpdateOrderAsync(SalesOrder order)
        {
            // Business Rule: Recalculate totals from line items before saving
            RecalculateTotals(order);
            return await _repository.UpdateOrderAsync(order);
        }

        /// <summary>
        /// Recalculates header-level totals from the line items.
        /// This ensures the database totals always match the line details.
        /// </summary>
        private static void RecalculateTotals(SalesOrder order)
        {
            order.TotalExcl = order.SalesOrderLines.Sum(l => l.ExclAmount);
            order.TotalTax  = order.SalesOrderLines.Sum(l => l.TaxAmount);
            order.TotalIncl = order.SalesOrderLines.Sum(l => l.InclAmount);
        }
    }
}
