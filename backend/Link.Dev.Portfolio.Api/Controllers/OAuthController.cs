using Link.Dev.Profolie.BLL.Dto;
using Link.Dev.Profolie.BLL.Dto.OAuth;
using Link.Dev.Profolie.BLL.interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace Link.Dev.Profolie.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableRateLimiting("AuthPolicy")]
    public class OAuthController : ControllerBase
    {
        private readonly IAccountServices _accountServices;
        private readonly RoleManager<IdentityRole> _roleManager;

        public OAuthController(IAccountServices accountServices, RoleManager<IdentityRole> roleManager)
        {
            _accountServices = accountServices;
            _roleManager     = roleManager;
        }

        // POST api/oauth/register
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .FirstOrDefault() ?? "Invalid input.";
                return BadRequest(new { message = errors });
            }

            var result = await _accountServices.RegisiterAsync(dto);
            if (result.IsSuccess)
            {
                return Ok(new
                {
                    message    = "Registration successful.",
                    token      = result.Token ?? string.Empty,
                    expiration = result.Expiration.ToString("M/d/yyyy h:mm tt")
                });
            }

            return BadRequest(new { message = result.Message ?? "Registration failed." });
        }



        // POST api/oauth/login
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _accountServices.LoginAsync(dto);
            return Ok(new
            {
                token      = response.Token,
                expiration = response.Expiration.ToString("M/d/yyyy h:mm tt")
            });
        }

        // POST api/oauth/logout
        [HttpPost("Logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _accountServices.LogOut();
            return Ok(new { message = "Logged out successfully." });
        }

        // POST api/oauth/register-admin  — Admin only
        [HttpPost("Register-Admin")]
        //[Authorize(Roles = "Admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var success = await _accountServices.RegisterAdminAsync(dto);
            if (success)
                return Ok(new { message = "Admin registered successfully." });

            return BadRequest(new { message = "Failed to register admin." });
        }

        // POST api/oauth/create-roles  — one-time seed, Admin only (or open for first run)
        [HttpPost("Create-Roles")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateRoles()
        {
            string[] roles = { "Admin", "User" };
            foreach (var role in roles)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                    await _roleManager.CreateAsync(new IdentityRole(role));
            }
            return Ok(new { message = "Roles created." });
        }
    }
}
