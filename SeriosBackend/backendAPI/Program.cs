using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using backendAPI.Models;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

// Add CORS services to allow all origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseRouting();

// Enable CORS
app.UseCors("AllowAllOrigins");

app.UseAuthorization();

app.MapControllers();






var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/userDetail", () =>
{
    var forecast =  Enumerable.Range(1, 20).Select(index =>
        new userDetail
        (   
            // index,
            // summaries[Random.Shared.Next(summaries.Length)],
            // summaries[Random.Shared.Next(summaries.Length)],
            // summaries[Random.Shared.Next(summaries.Length)],
            // summaries[Random.Shared.Next(summaries.Length)],
            // summaries[Random.Shared.Next(summaries.Length)],
            // Random.Shared.Next(100000000, 999999999),
            // summaries[Random.Shared.Next(summaries.Length)],
            // summaries[Random.Shared.Next(summaries.Length)],
            // DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            // Random.Shared.Next(1000, 1000000),
            // Random.Shared.Next(1000, 1000000),
            // Random.Shared.Next(1000, 1000000),
            // Random.Shared.Next(1000, 1000000),
            // Random.Shared.Next(1000, 1000000)
        index, 
        "john.doe@example.com", 
        "John Doe", 
        "USA", 
        "California", 
        "Los Angeles", 
        1234567890, 
        "123 Main St", 
        "Apt 4B", 
        DateOnly.FromDateTime(DateTime.Now.AddDays(index)), 
        50000, 
        52000, 
        54000, 
        56000, 
        58000
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

// record userDetail()
record WeatherForecast(string? Summary, DateOnly Date, int TemperatureC, string? Summar)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
