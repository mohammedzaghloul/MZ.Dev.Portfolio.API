using Link.Dev.Profolie.BLL.Dto;
using Link.Dev.Profolie.BLL.Dto.OAuth;
using Link.Dev.Profolie.BLL.Helper;
using Link.Dev.Profolie.BLL.interfaces;
using Link.Dev.Profolie.DAL.Model;
using Link.Dev.Profolie.DAL.UnitOfWorks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace Link.Dev.Profolie.BLL.Services
{
    public class AccountServicse : IAccountServices
    {
        #region DI
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly ITokenService tokenService;
        private readonly IUnitOfWork unitOfWork;

        public AccountServicse(UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<ApplicationUser> signInManager,
            ITokenService tokenService,
            IUnitOfWork unitOfWork)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.signInManager = signInManager;
            this.tokenService = tokenService;
            this.unitOfWork = unitOfWork;
        }
        #endregion
        public async Task<Response> LoginAsync(LoginDto dto)
        {
            try
            {
                var user = await userManager.FindByEmailAsync(dto.Email);
                if (user == null)
                {
                    throw new UnauthorizedAccessException("عذراً، البريد الإلكتروني غير مسجل لدينا.");
                }

                var isPasswordValid = await signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
                if (!isPasswordValid.Succeeded)
                {
                    throw new UnauthorizedAccessException("عذراً، البريد الإلكتروني و كلمة المرور غير متطابقة.");
                }

                var roles = await userManager.GetRolesAsync(user);
                string role = roles.Contains("Admin") ? "Admin" : roles.FirstOrDefault() ?? "User";

                if (user.Email == null || user.UserName == null)
                {
                    throw new UnauthorizedAccessException("عذراً، البريد الإلكتروني غير مسجل لدينا.");
                }

                var createToken = new CreateTokenFormate
                {
                    userId = user.Id,
                    email = user.Email,
                    role = role,
                    Name = user.UserName
                };

                var token =  tokenService.CreateToken(createToken);

                return new Response
                {
                    Token = token.Token,
                    Expiration = token.Expiration
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error");
                return new Response
                {
                    IsSuccess = false,
                    Message = $"Failed to log in: {ex.Message}",
                    Errors = new List<string> { ex.Message },
                    Token = "i",
                };
            }
        }

        public async Task LogOut()
        {
          await  signInManager.SignOutAsync();
        }
        public async Task< Response> RegisiterAsync(RegisterDto dto)
        {
            try
            {
                var user = new ApplicationUser { UserName = dto.UserName, Email = dto.Email };
                var result = await userManager.CreateAsync(user, dto.Password);
                if (result.Succeeded)
                {
                    // Ensure "User" role exists (safety net for fresh databases)
                    if (!await roleManager.RoleExistsAsync("User"))
                        await roleManager.CreateAsync(new IdentityRole("User"));

                    // Add to role "User"
                    var addRoleResult = await userManager.AddToRoleAsync(user, "User");
                    if (!addRoleResult.Succeeded)
                    {
                        return new Response
                        {
                            Message = "Failed to add user to 'User' role.",
                            Errors = addRoleResult.Errors.Select(e => e.Description).ToList(),
                            IsSuccess = false
                        };
                    }

                    // Create token
                    var createToken = new CreateTokenFormate
                    {
                        userId = user.Id,
                        email = user.Email,
                        role = "User", // Directly use the role name as a string
                        Name = user.UserName
                    };

                    try
                    {
                        var token =  tokenService.CreateToken(createToken);
                        
                        return new Response
                        {
                            IsSuccess = true,
                            Message = "Create Succeeded",
                            Errors = result.Errors.Select(e => e.Description).ToList(),
                            Token = token.Token,
                            Expiration = token.Expiration
                        };
                    }
                    catch (Exception ex)
                    {
                        return new Response
                        {
                            Message = $"Failed to create token: {ex.Message}",
                            Errors = new List<string> { ex.Message },
                            IsSuccess = false
                        };
                    }
                }

                string errorMessage = result.Errors.Any() ? result.Errors.First().Description : "حدث خطأ أثناء إنشاء الحساب.";

                return new Response
                {
                    Message = errorMessage,
                    Errors = result.Errors.Select(e => e.Description).ToList(),
                    IsSuccess = false
                };
            }
            catch (Exception ex)
            {
                return new Response
                {
                    IsSuccess = false,
                    Message = $"Database operation failed: {ex.Message}",
                    Errors = new List<string> { ex.InnerException?.Message ?? ex.Message }
                };
            }
        }

        public async Task<bool> RegisterAdminAsync(RegisterDto dto)
        {
            try
            {
                var user = new ApplicationUser { UserName = dto.UserName, Email = dto.Email };
                var result = await userManager.CreateAsync(user, dto.Password);


                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "Admin");
                    return true;
                }
            }
            catch (Exception)
            {

                throw new Exception("rweeeeeeeee") ;
            }

            return false;
        }
    }
}
