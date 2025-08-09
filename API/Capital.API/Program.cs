
using Capital.API.Extensions;
using Capital.API.Middlevares;
using Capital.BL;
using Capital.DAL;
using Capital.DAL.Context;
using Microsoft.EntityFrameworkCore;

namespace Capital.API;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddDbContext<AppDbContext>(opt =>
            opt.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

        builder.Services.ConfigureCustomApiBehavior();

        builder.Services.AddRepositories();
        builder.Services.AddServices(); 
        builder.Services.AddMapper();
        builder.Services.AddCache();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseMiddleware<ExceptionMiddleware>();
        app.UseAuthorization();


        app.MapControllers();

        app.Run();
    }
}

