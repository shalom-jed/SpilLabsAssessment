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
        private readonly IItemRepository _repository;
        private readonly IMapper _mapper;

        public ItemsController(IItemRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetItems()
        {
            var items = await _repository.GetAllItemsAsync();
            return Ok(_mapper.Map<IEnumerable<ItemDto>>(items));
        }
    }
}