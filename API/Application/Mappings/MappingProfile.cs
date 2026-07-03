using AutoMapper;
using API.Domain.Entities;
using API.Models;

namespace API.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Simple 1-to-1 mappings
            CreateMap<Client, ClientDto>().ReverseMap();
            CreateMap<Item, ItemDto>().ReverseMap();

            // Complex mappings (handling flattened data)
            CreateMap<SalesOrder, SalesOrderDto>()
                .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Client != null ? src.Client.CustomerName : null));

            CreateMap<SalesOrderDto, SalesOrder>(); // For mapping incoming POST requests back to entities

            CreateMap<SalesOrderLine, SalesOrderLineDto>()
                .ForMember(dest => dest.ItemCode, opt => opt.MapFrom(src => src.Item != null ? src.Item.ItemCode : null))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Item != null ? src.Item.Description : null));

            CreateMap<SalesOrderLineDto, SalesOrderLine>();
        }
    }
}