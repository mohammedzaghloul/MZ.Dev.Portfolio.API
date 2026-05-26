using Link.Dev.Profolie.BLL.Dto.SkillDto;
using Link.Dev.Profolie.BLL.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Link.Dev.Profolie.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillController : ControllerBase
    {
        private readonly ISkillService _skillService;

        public SkillController(ISkillService skillService)
        {
            _skillService = skillService;
        }

        // GET api/skill
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<SkillResponse>>> GetAll()
        {
            var skills = await _skillService.GetAllAsync();
            return Ok(skills);
        }

        // GET api/skill/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<SkillResponse>> GetById(int id)
        {
            var skill = await _skillService.GetByIdAsync(id);
            return Ok(skill);
        }

        // GET api/skill/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IReadOnlyList<SkillResponse>>> GetByUserId(string userId)
        {
            var skills = await _skillService.GetByUserIdAsync(userId);
            return Ok(skills);
        }

        // POST api/skill
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<SkillResponse>> Create([FromBody] CreateSkillDto dto)
        {
            var created = await _skillService.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // PUT api/skill/5
        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult> Update(int id, [FromBody] UpdateSkillDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID mismatch.");

            await _skillService.UpdateAsync(dto);
            return NoContent();
        }

        // DELETE api/skill/5
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<ActionResult> Delete(int id)
        {
            await _skillService.DeleteAsync(id);
            return NoContent();
        }
    }
}
