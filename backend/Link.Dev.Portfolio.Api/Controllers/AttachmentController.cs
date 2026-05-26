using Link.Dev.Profolie.BLL.interfaces.Upload;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Link.Dev.Profolie.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [EnableRateLimiting("UploadPolicy")]
    public class AttachmentController : ControllerBase
    {
        private readonly IAttachmentService _attachmentService;

        public AttachmentController(IAttachmentService attachmentService)
        {
            _attachmentService = attachmentService;
        }

        // POST api/attachment/upload
        [HttpPost("upload")]
        public async Task<ActionResult<string>> UploadFile([FromForm] FileUploadDto dto, [FromQuery] string folderPath = "uploads")
        {
            if (dto == null || dto.File == null)
            {
                return BadRequest("No file uploaded.");
            }

            var url = await _attachmentService.UploadFileAsync(dto.File, folderPath);
            return Ok(new { url });
        }

        // POST api/attachment/upload-multiple
        [HttpPost("upload-multiple")]
        public async Task<ActionResult<List<string>>> UploadMultipleFiles(
            [FromForm] MultipleFilesUploadDto dto, [FromQuery] string folderPath = "uploads")
        {
            if (dto == null || dto.Files == null || dto.Files.Count == 0)
            {
                return BadRequest("No files uploaded.");
            }

            var urls = await _attachmentService.UploadImagesAsync(dto.Files, folderPath);
            return Ok(urls);
        }

        // PUT api/attachment/update
        [HttpPut("update")]
        public async Task<ActionResult<string>> UpdateFile(
            [FromForm] FileUploadDto dto, [FromQuery] string oldUrl, [FromQuery] string folderPath = "uploads")
        {
            if (dto == null || dto.File == null)
            {
                return BadRequest("No file uploaded.");
            }

            var url = await _attachmentService.UpdateFileAsync(dto.File, oldUrl, folderPath);
            return Ok(new { url });
        }

        // DELETE api/attachment/delete
        [HttpDelete("delete")]
        public ActionResult DeleteFile([FromQuery] string fileName, [FromQuery] string folderPath = "uploads")
        {
            var result = _attachmentService.DeleteFile(fileName, folderPath);
            if (!result)
                return NotFound(new { message = "File not found or could not be deleted." });

            return NoContent();
        }
    }

    public class FileUploadDto
    {
        public IFormFile File { get; set; }
    }

    public class MultipleFilesUploadDto
    {
        public List<IFormFile> Files { get; set; }
    }
}

