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
            // Re-load with navigation properties so the returned DTO is fully populated
            return (await GetOrderByIdAsync(order.SalesOrderId))!;
        }

        public async Task<SalesOrder> UpdateOrderAsync(SalesOrder order)
        {
            // Load the existing tracked entity so EF Core can diff it correctly
            var existing = await _context.SalesOrders
                .Include(o => o.SalesOrderLines)
                .FirstOrDefaultAsync(o => o.SalesOrderId == order.SalesOrderId);

            if (existing == null)
                throw new KeyNotFoundException($"SalesOrder {order.SalesOrderId} not found.");

            // Update header fields
            existing.ClientId     = order.ClientId;
            existing.InvoiceNo    = order.InvoiceNo;
            existing.InvoiceDate  = order.InvoiceDate;
            existing.ReferenceNo  = order.ReferenceNo;
            existing.Note         = order.Note;
            existing.TotalExcl    = order.TotalExcl;
            existing.TotalTax     = order.TotalTax;
            existing.TotalIncl    = order.TotalIncl;

            // Replace child lines: remove all old lines, add the new ones
            _context.SalesOrderLines.RemoveRange(existing.SalesOrderLines);
            foreach (var line in order.SalesOrderLines)
            {
                line.SalesOrderId = existing.SalesOrderId;
                line.SalesOrderLineId = 0; // ensure EF inserts as new
                existing.SalesOrderLines.Add(line);
            }

            await _context.SaveChangesAsync();
            return (await GetOrderByIdAsync(existing.SalesOrderId))!;
        }
    }
}