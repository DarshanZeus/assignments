// using MySqlConnector;
using MySql.Data.MySqlClient;
using Backend_Excel.Controllers;
using Backend_Excel.Models;

      
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddTransient<MySqlConnection>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("DefaultConnection");
    return new MySqlConnection(connectionString);
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

// builder.Services.AddMySqlDataSource(builder.Configuration.GetConnectionString("Default")!);
// builder.services.AddTransient<MySqlConnection>(_ =>
//     new MySqlConnection(builder.Configuration.GetConnectionString["Default"]));





var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.MapControllers();
app.UseHttpsRedirection();


// app.MapGet("/weatherforecast/", async (int rowNo = 1) =>
// {
//     // var connectionStringBuilder = new MySqlConnectionStringBuilder
//     // {
//     //     Server = "127.0.0.1",
//     //     UserID = "root",
//     //     Password = "PASSWORD",
//     //     Database = "excel_clone",
//     // };


//     // // open a connection asynchronously
//     using var command = connection.CreateCommand();
//     string query = @"SELECT * FROM excel_clone.excel_data;";
//     command.CommandText = query;
//     // command.Parameters.AddWithValue("@OrderId", orderId);

//     // MySqlCommand command = new MySqlCommand(query, connection);
//     // var rowsAffected = command.ExecuteNonQuery();
//     using var reader = await command.ExecuteReaderAsync();


//     while (reader.Read())
//     {
//         // Console.WriteLine(reader["matrixName"].ToString());
//         // Console.WriteLine(reader["rowNo"].ToString());
//         // Console.WriteLine(reader["colNo"].ToString());
//         // Console.WriteLine(reader["cellValue"].ToString());
//         // var value = reader[3];
//         // return value;
//         // Console.WriteLine(value.ToString());
//     }
//     // Console.WriteLine(rowsAffected);
//     Console.WriteLine(rowNo);

//     return "forecast";
// })
// .WithName("GetWeatherForecast")
// .WithOpenApi();

app.Run();

