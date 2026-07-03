using API.Application.Interfaces;
using API.Domain.Entities;

namespace API.Application.Services
{
    /// <summary>
    /// Business Logic Layer service for Client operations.
    /// Wraps the IClientRepository and can apply business rules before/after data access.
    /// </summary>
    public class ClientService : IClientService
    {
        private readonly IClientRepository _repository;

        public ClientService(IClientRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Client>> GetAllClientsAsync()
        {
            return await _repository.GetAllClientsAsync();
        }
    }
}
