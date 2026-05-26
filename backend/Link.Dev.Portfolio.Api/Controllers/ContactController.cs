using Link.Dev.Profolie.BLL.Dto.ContactDto;
using Link.Dev.Profolie.BLL.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Link.Dev.Profolie.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableRateLimiting("WritePolicy")]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        // GET api/contact
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ContactResponse>>> GetAll()
        {
            var contacts = await _contactService.GetAllAsync();
            return Ok(contacts);
        }

        // GET api/contact/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ContactResponse>> GetById(int id)
        {
            var contact = await _contactService.GetByIdAsync(id);
            return Ok(contact);
        }

        // GET api/contact/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<ContactResponse>> GetByUserId(string userId)
        {
            var contact = await _contactService.GetByUserIdAsync(userId);
            if (contact == null)
                return NotFound(new { message = $"No contact found for user {userId}." });

            return Ok(contact);
        }

        // POST api/contact
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ContactResponse>> Create([FromBody] CreateContactDto dto)
        {
            var created = await _contactService.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // PUT api/contact/5
        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<ActionResult> Update(int id, [FromBody] UpdateContactDto dto)
        {
            if (id != dto.Id)
                return BadRequest("ID mismatch.");

            await _contactService.UpdateAsync(dto);
            return NoContent();
        }

        // DELETE api/contact/5
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<ActionResult> Delete(int id)
        {
            await _contactService.DeleteAsync(id);
            return NoContent();
        }
    }
}
