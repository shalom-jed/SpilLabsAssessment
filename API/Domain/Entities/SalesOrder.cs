namespace API.Domain.Entities
{
    public class SalesOrder
    {
        public int SalesOrderId { get; set; }
        public string? InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; } = DateTime.Now;
        public string? ReferenceNo { get; set; }
        public string? Note { get; set; }
        public int ClientId { get; set; }
        public decimal TotalExcl { get; set; }
        public decimal TotalTax { get; set; }
        public decimal TotalIncl { get; set; }
        
        public Client? Client { get; set; }
        public List<SalesOrderLine> SalesOrderLines { get; set; } = new();
    }
}