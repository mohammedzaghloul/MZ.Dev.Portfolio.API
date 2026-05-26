using Link.Dev.Profolie.BLL.Dto.ProjectDto;
using Link.Dev.Profolie.BLL.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Link.Dev.Profolie.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectServices _projectService;

        public ProjectController(IProjectServices projectService)
        {
            _projectService = projectService;
        }

        // GET api/project
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<GetAllProject>>> GetAll()
        {
            var projects = await _projectService.GetAllAsync();
            return Ok(projects);
        }

        // GET api/project/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<GetByIdProject>> GetById(int id)
        {
            var project = await _projectService.GetByIdAsync(id);
            return Ok(project);
        }

        // GET api/project/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IReadOnlyList<GetAllProject>>> GetByUserId(string userId)
        {
            var projects = await _projectService.GetByUserIdAsync(userId);
            return Ok(projects);
        }

        // POST api/project  — uses [FromForm] because dto contains IFormFile
        [HttpPost]
        [Authorize]
        public async Task<ActionResult> Create([FromForm] CreateProjectDto dto)
        {
            await _projectService.AddAsync(dto);
            return StatusCode(201, new { message = "Project created successfully." });
        }

        // PUT api/project/5  — uses [FromForm] because dto contains IFormFile
        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult> Update(int id, [FromForm] ProjectUpdateDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID mismatch.");

            await _projectService.UpdateAsync(dto);
            return NoContent();
        }

        // DELETE api/project/5
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<ActionResult> Delete(int id)
        {
            await _projectService.DeleteAsync(id);
            return NoContent();
        }
    }
}
