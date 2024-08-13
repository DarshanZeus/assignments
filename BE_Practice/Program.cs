using Microsoft.EntityFrameworkCore;
// using BE_Practice.Data;
using BE_Practice.DataObjects; 
using BE_Practice.Controllers;
using BE_Practice.Models;
using MySqlConnection;



internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddControllers();
        // builder.Services.AddMySqlDataSource(builder.Configuration.GetConnectionString("ConnectionStrings:DefaultConnection")!);
        builder.Services.AddTransient<MySqlConnection>(_ =>
        new MySqlConnection(builder.Configuration.GetConnectionString["Default"]));


        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseExceptionHandler("/Home/Error");
            app.UseHsts();
        }

        app.UseHttpsRedirection();
        
        app.MapControllers();
        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseCors("AllowAll");

        app.UseAuthentication();
        app.UseAuthorization();


        // app.MapGet("/excelData", () =>
        // {
            

        //     ExcelCloneContext excelCloneContext = new ExcelCloneContext();
        //     var xlData = excelCloneContext.ExcelData.ToList();
        //     // Console.WriteLine("Hi", xlData.Count);
            
        //     return xlData;
        // })
        // .WithName("GetWeatherForecast")
        // .WithOpenApi();
        
        app.Run();
    }
}

