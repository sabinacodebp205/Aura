using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Aura.Application.Sevices.Interfaces
{
    public interface IFileUploadService
    {
        Task<string> SaveProductImageAsync(IFormFile file);

        void DeleteProductImage(string imageUrl);
    }
}