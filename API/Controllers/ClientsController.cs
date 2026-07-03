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
        private readonly IClientRepository _repository;
        private readonly IMapper _mapper;

        public ClientsController(IClientRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClientDto>>> GetClients()
        {
            var clients = await _repository.GetAllClientsAsync();
            return Ok(_mapper.Map<IEnumerable<ClientDto>>(clients));
        }
    }
}