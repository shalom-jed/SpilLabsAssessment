namespace API.Models
{
    public class SalesOrderDto
    {
        public int SalesOrderId { get; set; }
        public string? InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string? ReferenceNo { get; set; }
        public string? Note { get; set; }
        public int ClientId { get; set; }
        
        // Flattened from the Client entity to make it easy for the frontend to display the name
        public string? CustomerName { get; set; } 

        public decimal TotalExcl { get; set; }
        public decimal TotalTax { get; set; }
        public decimal TotalIncl { get; set; }

        public List<SalesOrderLineDto> SalesOrderLines { get; set; } = new();
    }
}