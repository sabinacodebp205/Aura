using Amazon.S3;
using Amazon.S3.Model;
using Aura.Application.Sevices.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Aura.API.Services
{
    public class FileUploadService : IFileUploadService
    {
        private readonly IWebHostEnvironment _env;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;

        private static readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private const long _maxFileSize = 5 * 1024 * 1024; // 5 MB

        public FileUploadService(IWebHostEnvironment env, IConfiguration config, IHttpContextAccessor httpContextAccessor)
        {
            _env = env;
            _config = config;
            _httpContextAccessor = httpContextAccessor;
        }

        private string GetRootPath()
        {
            if (!string.IsNullOrEmpty(_env.WebRootPath))
            {
                return _env.WebRootPath;
            }

            var fallback = Path.Combine(_env.ContentRootPath, "wwwroot");
            if (!Directory.Exists(fallback))
            {
                Directory.CreateDirectory(fallback);
            }
            return fallback;
        }

        private string GetBaseUrl()
        {
            var req = _httpContextAccessor.HttpContext?.Request;
            if (req != null)
            {
                return $"{req.Scheme}://{req.Host}";
            }
            return string.Empty;
        }

        private bool IsCloudStorageConfigured(out string endpoint, out string bucketName, out string accessKey, out string secretKey, out string publicBaseUrl)
        {
            endpoint = _config["Storage:Endpoint"] ?? string.Empty;
            bucketName = _config["Storage:BucketName"] ?? string.Empty;
            accessKey = _config["Storage:AccessKey"] ?? string.Empty;
            secretKey = _config["Storage:SecretKey"] ?? string.Empty;
            publicBaseUrl = _config["Storage:PublicBaseUrl"] ?? string.Empty;

            return !string.IsNullOrWhiteSpace(accessKey) &&
                   !string.IsNullOrWhiteSpace(secretKey) &&
                   !string.IsNullOrWhiteSpace(bucketName);
        }

        private AmazonS3Client CreateS3Client(string endpoint, string accessKey, string secretKey)
        {
            var config = new AmazonS3Config
            {
                ForcePathStyle = true
            };

            if (!string.IsNullOrWhiteSpace(endpoint))
            {
                config.ServiceURL = endpoint;
            }

            return new AmazonS3Client(accessKey, secretKey, config);
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

            if (IsCloudStorageConfigured(out var endpoint, out var bucketName, out var accessKey, out var secretKey, out var publicBaseUrl))
            {
                var objectKey = $"uploads/products/{fileName}";
                using var client = CreateS3Client(endpoint, accessKey, secretKey);
                using var stream = file.OpenReadStream();

                var putRequest = new PutObjectRequest
                {
                    BucketName = bucketName,
                    Key = objectKey,
                    InputStream = stream,
                    ContentType = file.ContentType ?? "image/jpeg"
                };

                await client.PutObjectAsync(putRequest);

                if (!string.IsNullOrWhiteSpace(publicBaseUrl))
                {
                    return $"{publicBaseUrl.TrimEnd('/')}/{objectKey}";
                }

                return $"{endpoint.TrimEnd('/')}/{bucketName}/{objectKey}";
            }
            else
            {
                var rootPath = GetRootPath();
                var folderPath = Path.Combine(rootPath, "uploads", "products");

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var baseUrl = GetBaseUrl();
                var relativePath = $"/uploads/products/{fileName}";

                return string.IsNullOrEmpty(baseUrl) ? relativePath : $"{baseUrl}{relativePath}";
            }
        }

        public async Task<string> SaveDesignPatternAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new Exception("File is empty.");

            const long maxPatternSize = 10 * 1024 * 1024; // 10 MB limit as per prompt spec
            if (file.Length > maxPatternSize)
                throw new Exception("File size exceeds the 10 MB limit.");

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (extension != ".png" && extension != ".jpg" && extension != ".jpeg" && extension != ".webp")
                throw new Exception("Invalid pattern file type. Only PNG, JPG, JPEG, and WebP are allowed.");

            var fileName = $"{Guid.NewGuid()}{extension}";

            if (IsCloudStorageConfigured(out var endpoint, out var bucketName, out var accessKey, out var secretKey, out var publicBaseUrl))
            {
                var objectKey = $"uploads/designs/{fileName}";
                using var client = CreateS3Client(endpoint, accessKey, secretKey);
                using var stream = file.OpenReadStream();

                var putRequest = new PutObjectRequest
                {
                    BucketName = bucketName,
                    Key = objectKey,
                    InputStream = stream,
                    ContentType = file.ContentType ?? "image/png"
                };

                await client.PutObjectAsync(putRequest);

                if (!string.IsNullOrWhiteSpace(publicBaseUrl))
                {
                    return $"{publicBaseUrl.TrimEnd('/')}/{objectKey}";
                }

                return $"{endpoint.TrimEnd('/')}/{bucketName}/{objectKey}";
            }
            else
            {
                var rootPath = GetRootPath();
                var folderPath = Path.Combine(rootPath, "uploads", "designs");

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var filePath = Path.Combine(folderPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var baseUrl = GetBaseUrl();
                var relativePath = $"/uploads/designs/{fileName}";

                return string.IsNullOrEmpty(baseUrl) ? relativePath : $"{baseUrl}{relativePath}";
            }
        }

        public void DeleteProductImage(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl))
                return;

            var fileName = Path.GetFileName(imageUrl);

            if (IsCloudStorageConfigured(out var endpoint, out var bucketName, out var accessKey, out var secretKey, out _))
            {
                var objectKey = $"uploads/products/{fileName}";
                using var client = CreateS3Client(endpoint, accessKey, secretKey);
                client.DeleteObjectAsync(bucketName, objectKey).GetAwaiter().GetResult();
            }
            else
            {
                var rootPath = GetRootPath();
                var filePath = Path.Combine(rootPath, "uploads", "products", fileName);

                if (File.Exists(filePath))
                    File.Delete(filePath);
            }
        }
    }
}