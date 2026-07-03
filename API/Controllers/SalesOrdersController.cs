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
        private readonly ISalesOrderRepository _repository;
        private readonly IMapper _mapper;

        public SalesOrdersController(ISalesOrderRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalesOrderDto>>> GetOrders()
        {
            var orders = await _repository.GetAllOrdersAsync();
            return Ok(_mapper.Map<IEnumerable<SalesOrderDto>>(orders));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SalesOrderDto>> GetOrder(int id)
        {
            var order = await _repository.GetOrderByIdAsync(id);
            if (order == null) return NotFound();
            return Ok(_mapper.Map<SalesOrderDto>(order));
        }

        [HttpPost]
        public async Task<ActionResult<SalesOrderDto>> CreateOrder(SalesOrderDto orderDto)
        {
            var order = _mapper.Map<SalesOrder>(orderDto);
            var createdOrder = await _repository.CreateOrderAsync(order);
            
            return CreatedAtAction(
                nameof(GetOrder), 
                new { id = createdOrder.SalesOrderId }, 
                _mapper.Map<SalesOrderDto>(createdOrder)
            );
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, SalesOrderDto orderDto)
        {
            if (id != orderDto.SalesOrderId) return BadRequest();
            
            var order = _mapper.Map<SalesOrder>(orderDto);
            await _repository.UpdateOrderAsync(order);
            
            return NoContent();
        }
    }
}