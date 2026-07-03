using API.Domain.Entities;

namespace API.Application.Interfaces
{
    public interface IClientService
    {
        Task<IEnumerable<Client>> GetAllClientsAsync();
    }
}
