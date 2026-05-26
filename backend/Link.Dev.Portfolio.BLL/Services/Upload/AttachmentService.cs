using Link.Dev.Profolie.BLL.interfaces.Upload;
using Microsoft.AspNetCore.Http;

namespace Link.Dev.Profolie.BLL.Services.Upload
{
    public class AttachmentService : IAttachmentService
    {
        private readonly List<string> AllowedExtensions = new() { ".jpg", ".jpeg", ".png", ".gif", ".pdf" };
        private readonly long MaxFileSize = 5 * 1024 * 1024; // 5MB

        public async Task<string> UploadFileAsync(IFormFile file, string folderPath, List<string>? allowedExtensions = null, long? maxFileSize = null)
        {
            if (file == null || file.Length == 0)
                throw new Exception("File is required");

            var extension = Path.GetExtension(file.FileName).ToLower();

            var extensions = allowedExtensions ?? AllowedExtensions;
            if (!extensions.Contains(extension))
                throw new Exception($"Invalid file type. Allowed: {string.Join(", ", extensions)}");

            var sizeLimit = maxFileSize ?? MaxFileSize;
            if (file.Length > sizeLimit)
                throw new Exception($"File size exceeds limit ({sizeLimit / 1024 / 1024}MB)");

            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folderPath);

            if (!Directory.Exists(fullPath))
                Directory.CreateDirectory(fullPath);

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(fullPath, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            return $"/{folderPath}/{fileName}";
        }

        public async Task<List<string>> UploadImagesAsync(IEnumerable<IFormFile> files, string folderPath, List<string>? allowedExtensions = null, long? maxFileSize = null)
        {
            var result = new List<string>();

            foreach (var file in files)
            {
                var url = await UploadFileAsync(file, folderPath, allowedExtensions, maxFileSize);
                result.Add(url);
            }

            return result;
        }

        public async Task<string> UpdateFileAsync(IFormFile file, string oldUrl, string folderPath, List<string>? allowedExtensions = null, long? maxFileSize = null)
        {
            if (!string.IsNullOrEmpty(oldUrl))
            {
                var fileName = Path.GetFileName(oldUrl);
                DeleteFile(fileName, folderPath);
            }

            return await UploadFileAsync(file, folderPath, allowedExtensions, maxFileSize);
        }

        public bool DeleteFile(string fileName, string folderPath)
        {
            if (string.IsNullOrEmpty(fileName)) return false;

            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folderPath, fileName);

            if (!File.Exists(fullPath))
                return false;

            try
            {
                File.Delete(fullPath);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}