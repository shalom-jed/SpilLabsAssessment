using API.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Infrastructure.Data
{
    public class SpilDbContext : DbContext
    {
        public SpilDbContext(DbContextOptions<SpilDbContext> options) : base(options)
        {
        }

        public DbSet<Client> Clients { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<SalesOrder> SalesOrders { get; set; }
        public DbSet<SalesOrderLine> SalesOrderLines { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Entity Framework will automatically map these based on our naming conventions,
            // but we can explicitly define the SalesOrder -> SalesOrderLine relationship here if needed.
        }
    }
}