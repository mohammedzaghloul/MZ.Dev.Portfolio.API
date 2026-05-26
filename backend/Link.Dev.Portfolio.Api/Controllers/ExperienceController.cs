using Link.Dev.Profolie.BLL.Dto.ExperienceDto;
using Link.Dev.Profolie.BLL.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Link.Dev.Profolie.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExperienceController : ControllerBase
    {
        private readonly IExperienceService _experienceService;

        public ExperienceController(IExperienceService experienceService)
        {
            _experienceService = experienceService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _experienceService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _experienceService.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUserId(string userId)
        {
            var result = await _experienceService.GetExperiencesByUserIdAsync(userId);
            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateExperienceDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            await _experienceService.AddAsync(dto);
            return Ok(new { message = "Experience created successfully" });
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateExperienceDto dto)
        {
            if (id != dto.Id) return BadRequest("ID mismatch");
            if (!ModelState.IsValid) return BadRequest(ModelState);
            
            await _experienceService.UpdateAsync(dto);
            return Ok(new { message = "Experience updated successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _experienceService.DeleteAsync(id);
            if (result) return Ok(new { message = "Experience deleted successfully" });
            return NotFound(new { message = "Experience not found" });
        }
    }
}
