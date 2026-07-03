using API.Application.Interfaces;
using API.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly IClientService _service;
        private readonly IMapper _mapper;

        public ClientsController(IClientService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClientDto>>> GetClients()
        {
            var clients = await _service.GetAllClientsAsync();
            return Ok(_mapper.Map<IEnumerable<ClientDto>>(clients));
        }
    }
}