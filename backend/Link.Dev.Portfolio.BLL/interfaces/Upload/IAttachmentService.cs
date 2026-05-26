using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Link.Dev.Profolie.BLL.interfaces.Upload
{
    public interface IAttachmentService
    {
        Task<string> UploadFileAsync(IFormFile file, string folderPath, List<string>? allowedExtensions = null, long? maxFileSize = null);
        Task<List<string>> UploadImagesAsync(IEnumerable<IFormFile> files, string folderPath, List<string>? allowedExtensions = null, long? maxFileSize = null);
        Task<string> UpdateFileAsync(IFormFile file, string oldUrl, string folderPath, List<string>? allowedExtensions = null, long? maxFileSize = null);
        bool DeleteFile(string fileName, string folderPath);
    }
}
