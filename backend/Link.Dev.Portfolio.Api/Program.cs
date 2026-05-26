using Link.Dev.Profolie.Api.ExMethod;
using Link.Dev.Profolie.Api.Middleware;
using Link.Dev.Profolie.DAL.Data;
using Link.Dev.Profolie.DAL.Model;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

//  All Services 
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddSwagerServices();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    // Auto-apply Entity Framework migrations and seed roles on startup safely
    try
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await dbContext.Database.MigrateAsync();

        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        foreach (var role in new[] { "Admin", "User" })
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error during database initialization: {ex.Message}");
    }
}

#region Middleware

//  Global Exception Middleware 
app.UseMiddleware<ExceptionMiddleware>();

//  Swagger 
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Link.Dev Portfolio API v1");
    });
}

// app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseCors("AllowAll");

app.UseRateLimiter();

//  Auth 
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run(); 
#endregion