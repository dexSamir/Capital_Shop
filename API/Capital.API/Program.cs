
using Capital.API.Extensions;
using Capital.API.Middlevares;
using Capital.BL;
using Capital.BL.DTOs.Options;
using Capital.Core.Entities;
using Capital.DAL;
using Capital.DAL.Context;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Capital.API;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);


        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddDbContext<AppDbContext>(opt =>
            opt.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

        builder.Services.AddHttpContextAccessor();

        builder.Services.ConfigureCustomApiBehavior();

        builder.Services.AddIdentity<User, IdentityRole>()
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

        builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.Jwt));

        var jwtSettings = builder.Configuration.GetSection(JwtOptions.Jwt).Get<JwtOptions>();
        var key = Encoding.UTF8.GetBytes(jwtSettings.SecretKey);

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(key)
            };
        });

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowClient", policy =>
            {
                policy
                    .WithOrigins("http://localhost:5173", "https://localhost:5173", "https://capitalshopdex.netlify.app")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        builder.Services.AddRepositories();
        builder.Services.AddServices(); 
        builder.Services.AddMapper();
        builder.Services.AddCache();
        
       

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseMiddleware<ExceptionMiddleware>();
        app.UseCors("AllowClient");
        app.UseAuthentication();
        app.UseAuthorization();


        app.MapControllers();
        app.UseStaticFiles();

        using (var scope = app.Services.CreateScope())
        {
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            await AdminSeeder.SeedAsync(userManager, roleManager);

            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await DbInitializer.SeedAsync(dbContext);
        }


        app.Run();
    }
}

