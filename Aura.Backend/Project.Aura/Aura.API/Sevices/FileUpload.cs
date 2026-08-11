using Aura.Application.Sevices.Interfaces;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
namespace Aura.API.Services
{
    public class FileUploadService : IFileUploadService
    {
        private readonly IWebHostEnvironment _env;

        private static readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private const long _maxFileSize = 5 * 1024 * 1024; // 5 MB

        public FileUploadService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SaveProductImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new Exception("File is empty.");

            if (file.Length > _maxFileSize)
                throw new Exception("File size exceeds the 5 MB limit.");

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!_allowedExtensions.Contains(extension))
                throw new Exception("Invalid file type. Only jpg, jpeg, png and webp are allowed.");

            var fileName = $"{Guid.NewGuid()}{extension}";

            var folderPath = Path.Combine(_env.WebRootPath, "uploads", "products");

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/products/{fileName}";
        }

        public void DeleteProductImage(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl))
                return;

            var fileName = Path.GetFileName(imageUrl);
            var filePath = Path.Combine(_env.WebRootPath, "uploads", "products", fileName);

            if (File.Exists(filePath))
                File.Delete(filePath);
        }
    }
}