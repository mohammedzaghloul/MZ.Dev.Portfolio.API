using Link.Dev.Profolie.BLL.Dto.ProjectSkillDto;
using Link.Dev.Profolie.BLL.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Link.Dev.Profolie.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectSkillController : ControllerBase
    {
        private readonly IProjectSkillService _projectSkillService;

        public ProjectSkillController(IProjectSkillService projectSkillService)
        {
            _projectSkillService = projectSkillService;
        }

        // GET api/projectskill
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProjectSkillResponse>>> GetAll()
        {
            var projectSkills = await _projectSkillService.GetAllAsync();
            return Ok(projectSkills);
        }

        // GET api/projectskill/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProjectSkillResponse>> GetById(int id)
        {
            var projectSkill = await _projectSkillService.GetByIdAsync(id);
            return Ok(projectSkill);
        }

        // GET api/projectskill/project/3
        [HttpGet("project/{projectId:int}")]
        public async Task<ActionResult<IReadOnlyList<ProjectSkillResponse>>> GetByProjectId(int projectId)
        {
            var projectSkills = await _projectSkillService.GetByProjectIdAsync(projectId);
            return Ok(projectSkills);
        }

        // GET api/projectskill/skill/2
        [HttpGet("skill/{skillId:int}")]
        public async Task<ActionResult<IReadOnlyList<ProjectSkillResponse>>> GetBySkillId(int skillId)
        {
            var projectSkills = await _projectSkillService.GetBySkillIdAsync(skillId);
            return Ok(projectSkills);
        }

        // POST api/projectskill
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ProjectSkillResponse>> Create([FromBody] CreateProjectSkillDto dto)
        {
            var created = await _projectSkillService.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // DELETE api/projectskill/5
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<ActionResult> Delete(int id)
        {
            await _projectSkillService.DeleteAsync(id);
            return NoContent();
        }
    }
}
