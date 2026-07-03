using API.Application.Interfaces;
using API.Domain.Entities;
using API.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace API.Infrastructure.Repositories
{
    public class SalesOrderRepository : ISalesOrderRepository
    {
        private readonly SpilDbContext _context;

        public SalesOrderRepository(SpilDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SalesOrder>> GetAllOrdersAsync()
        {
            // Eager loading: We want the client name and the order items included when fetching the orders list
            return await _context.SalesOrders
                .Include(o => o.Client)
                .Include(o => o.SalesOrderLines)
                .ThenInclude(line => line.Item)
                .OrderByDescending(o => o.InvoiceDate)
                .ToListAsync();
        }

        public async Task<SalesOrder?> GetOrderByIdAsync(int id)
        {
            return await _context.SalesOrders
                .Include(o => o.Client)
                .Include(o => o.SalesOrderLines)
                .ThenInclude(line => line.Item)
                .FirstOrDefaultAsync(o => o.SalesOrderId == id);
        }

        public async Task<SalesOrder> CreateOrderAsync(SalesOrder order)
        {
            _context.SalesOrders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }

        public async Task<SalesOrder> UpdateOrderAsync(SalesOrder order)
        {
            _context.SalesOrders.Update(order);
            await _context.SaveChangesAsync();
            return order;
        }
    }
}