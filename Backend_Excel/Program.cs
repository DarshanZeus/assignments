// using MySqlConnector;
using MySql.Data.MySqlClient;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// builder.Services.AddMySqlDataSource(builder.Configuration.GetConnectionString("Default")!);
// builder.services.AddTransient<MySqlConnection>(_ =>
//     new MySqlConnection(builder.Configuration.GetConnectionString["Default"]));





var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.MapGet("/weatherforecast", async () =>
{
    var connectionStringBuilder = new MySqlConnectionStringBuilder
    {
        Server = "127.0.0.1",
        UserID = "root",
        Password = "PASSWORD",
        Database = "excel_clone",
    };


    // // open a connection asynchronously
    using var connection = new MySqlConnection(builder.Configuration.GetConnectionString("DefaultConnection"));
    await connection.OpenAsync();


    using var command = connection.CreateCommand();
    command.CommandText = @"SELECT * FROM excel_clone.excel_data;";
    // command.Parameters.AddWithValue("@OrderId", orderId);

    // // execute the command and read the results
    using var reader = await command.ExecuteReaderAsync();
    while (reader.Read())
    {
        Console.WriteLine(reader["matrixName"].ToString());
        Console.WriteLine(reader["rowNo"].ToString());
        Console.WriteLine(reader["colNo"].ToString());
        Console.WriteLine(reader["cellValue"].ToString());
    }
    Console.WriteLine("reader");



    return "forecast";
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

