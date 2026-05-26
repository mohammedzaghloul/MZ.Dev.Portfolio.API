using Link.Dev.Profolie.BLL.Dto.UserProfileDto;
using Link.Dev.Profolie.BLL.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Link.Dev.Profolie.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserProfileController : ControllerBase
    {
        private readonly IUserProfileService _userProfileService;

        public UserProfileController(IUserProfileService userProfileService)
        {
            _userProfileService = userProfileService;
        }

        // GET api/userprofile/me  — returns the currently authenticated user's profile
        [HttpGet("me")]
        public async Task<ActionResult<UserProfileResponse>> GetMyProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var profile = await _userProfileService.GetByIdAsync(userId);
            return Ok(profile);
        }

        // GET api/userprofile/{userId}  — public endpoint to view any user's profile
        [HttpGet("{userId}")]
        [AllowAnonymous]
        public async Task<ActionResult<UserProfileResponse>> GetById(string userId)
        {
            var profile = await _userProfileService.GetByIdAsync(userId);
            return Ok(profile);
        }

        // PUT api/userprofile/me  — update own profile + optional profile image
        [HttpPut("me")]
        public async Task<ActionResult<UserProfileResponse>> UpdateMyProfile([FromForm] UpdateUserProfileDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var updated = await _userProfileService.UpdateAsync(userId, dto);
            return Ok(updated);
        }

        // DELETE api/userprofile/me  — delete own account
        [HttpDelete("me")]
        public async Task<ActionResult> DeleteMyAccount()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            await _userProfileService.DeleteAsync(userId);
            return NoContent();
        }
    }
}
