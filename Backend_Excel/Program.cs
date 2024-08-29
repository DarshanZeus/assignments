using MySql.Data.MySqlClient;
using Backend_Excel.Controllers;
using Backend_Excel.Models;
using Elasticsearch.Net;
using Nest;
using Backend_Excel.extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy => policy.WithOrigins("http://127.0.0.1:5501") // Add the URL of your frontend application
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

builder.Services.AddTransient(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var connectionString = configuration.GetConnectionString("DefaultConnection");
    return new MySqlConnection(connectionString);
});


// Elasticsearch Configuration
var settings = new ConnectionSettings(new Uri("https://localhost:9200")) // Use HTTPS URL
                .DefaultIndex("cellModel")
                .BasicAuthentication("elastic", "WzB*7FBu-cVHcU39MIC6")  // Provide your Elasticsearch username and password
                .ServerCertificateValidationCallback(CertificateValidations.AllowAll);
                    // CertificateValidations.AllowAll);  // Ignore SSL certificate validation (for development only)

            // _elasticClient = new ElasticClient(settings);

var client = new ElasticClient(settings);
builder.Services.AddSingleton<IElasticClient>(client);

builder.Services.AddElasticsearch(builder.Configuration);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();

app.Run();
