using API.Application.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly IItemService _service;
        private readonly IMapper _mapper;

        public ItemsController(IItemService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetItems()
        {
            var items = await _service.GetAllItemsAsync();
            return Ok(_mapper.Map<IEnumerable<ItemDto>>(items));
        }
    }
}