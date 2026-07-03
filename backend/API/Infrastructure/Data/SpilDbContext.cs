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

            // Configure decimal precision for monetary fields to avoid truncation warnings
            modelBuilder.Entity<Item>()
                .Property(i => i.Price)
                .HasColumnType("decimal(18,4)");

            modelBuilder.Entity<SalesOrder>()
                .Property(o => o.TotalExcl).HasColumnType("decimal(18,4)");
            modelBuilder.Entity<SalesOrder>()
                .Property(o => o.TotalTax).HasColumnType("decimal(18,4)");
            modelBuilder.Entity<SalesOrder>()
                .Property(o => o.TotalIncl).HasColumnType("decimal(18,4)");

            modelBuilder.Entity<SalesOrderLine>()
                .Property(l => l.Price).HasColumnType("decimal(18,4)");
            modelBuilder.Entity<SalesOrderLine>()
                .Property(l => l.TaxRate).HasColumnType("decimal(18,4)");
            modelBuilder.Entity<SalesOrderLine>()
                .Property(l => l.ExclAmount).HasColumnType("decimal(18,4)");
            modelBuilder.Entity<SalesOrderLine>()
                .Property(l => l.TaxAmount).HasColumnType("decimal(18,4)");
            modelBuilder.Entity<SalesOrderLine>()
                .Property(l => l.InclAmount).HasColumnType("decimal(18,4)");

            // Cascade delete: deleting a SalesOrder deletes its lines
            modelBuilder.Entity<SalesOrder>()
                .HasMany(o => o.SalesOrderLines)
                .WithOne()
                .HasForeignKey(l => l.SalesOrderId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}