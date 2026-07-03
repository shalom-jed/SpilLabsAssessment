namespace API.Domain.Entities
{
    public class Item
    {
        public int ItemId { get; set; }
        public required string ItemCode { get; set; }
        public required string Description { get; set; }
    }
}