namespace API.Models
{
    public class SalesOrderLineDto
    {
        public int SalesOrderLineId { get; set; }
        public int SalesOrderId { get; set; }
        public int ItemId { get; set; }
        
        // Flattened from the Item entity
        public string? ItemCode { get; set; } 
        public string? Description { get; set; }

        public string? Note { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal TaxRate { get; set; }
        public decimal ExclAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal InclAmount { get; set; }
    }
}