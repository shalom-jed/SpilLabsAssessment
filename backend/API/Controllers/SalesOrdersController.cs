using API.Application.Interfaces;
using API.Domain.Entities;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesOrdersController : ControllerBase
    {
        private readonly ISalesOrderService _service;
        private readonly IMapper _mapper;

        public SalesOrdersController(ISalesOrderService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        // GET: api/salesorders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalesOrderDto>>> GetOrders()
        {
            var orders = await _service.GetAllOrdersAsync();
            return Ok(_mapper.Map<IEnumerable<SalesOrderDto>>(orders));
        }

        // GET: api/salesorders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SalesOrderDto>> GetOrder(int id)
        {
            var order = await _service.GetOrderByIdAsync(id);
            if (order == null) return NotFound();
            return Ok(_mapper.Map<SalesOrderDto>(order));
        }

        // POST: api/salesorders
        [HttpPost]
        public async Task<ActionResult<SalesOrderDto>> CreateOrder(SalesOrderDto orderDto)
        {
            var order = _mapper.Map<SalesOrder>(orderDto);
            var created = await _service.CreateOrderAsync(order);

            return CreatedAtAction(
                nameof(GetOrder),
                new { id = created.SalesOrderId },
                _mapper.Map<SalesOrderDto>(created)
            );
        }

        // PUT: api/salesorders/5
        [HttpPut("{id}")]
        public async Task<ActionResult<SalesOrderDto>> UpdateOrder(int id, SalesOrderDto orderDto)
        {
            if (id != orderDto.SalesOrderId) return BadRequest("ID mismatch.");

            var order = _mapper.Map<SalesOrder>(orderDto);
            var updated = await _service.UpdateOrderAsync(order);

            return Ok(_mapper.Map<SalesOrderDto>(updated));
        }
    }
}