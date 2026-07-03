using API.Domain.Entities;

namespace API.Application.Interfaces
{
    public interface IClientRepository
    {
        Task<IEnumerable<Client>> GetAllClientsAsync();
    }
}