using Capital.Core.Entities;
using Microsoft.AspNetCore.Identity;

namespace Capital.DAL;

public static class AdminSeeder
{
    public static async Task SeedAsync(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
    {
        // Roles
        string[] roles = ["Admin", "User"];
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole(role));
        }

        // Admin user
        string adminEmail = "hebibovsamir26@gmail.com";
        string adminPassword = "hebibovS13!";

        var existingAdmin = await userManager.FindByEmailAsync(adminEmail);
        if (existingAdmin is null)
        {
            var admin = new User
            {
                Name = "Samir",
                Surname = "Hebibov",
                Email = adminEmail,
                UserName = adminEmail,
                Gender = true,
                Age = 20,
                IsVerified = true,
                EmailConfirmed = true,
            };

            var result = await userManager.CreateAsync(admin, adminPassword);
            if (result.Succeeded)
                await userManager.AddToRoleAsync(admin, "Admin");
        }
        else
        {
            // User var, amma Admin rolu yoxdursa əlavə et
            if (!await userManager.IsInRoleAsync(existingAdmin, "Admin"))
                await userManager.AddToRoleAsync(existingAdmin, "Admin");
        }
    }
}