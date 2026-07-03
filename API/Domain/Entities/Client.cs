namespace API.Domain.Entities
{
    public class Client
    {
        public int ClientId { get; set; }
        public required string CustomerName { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? Address3 { get; set; }
        public string? Suburb { get; set; }
        public string? State { get; set; }
        public string? PostCode { get; set; }
    }
}