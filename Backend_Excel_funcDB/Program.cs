using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using CsvHelper;
using System.Globalization;
using System.IO;
using System.Collections.Generic;
using System.Linq;

GetChunk();

var factory = new ConnectionFactory { HostName = "localhost" };
using var connection = factory.CreateConnection();
using var channel = connection.CreateModel();

channel.QueueDeclare(
    queue: "chunkToDatabase",
    durable: false,
    exclusive: false,
    autoDelete: false,
    arguments: null
);

var consumer = new EventingBasicConsumer(channel);
consumer.Received += (model, ea) =>
{
    var body = ea.Body.ToArray();
    var message = Encoding.UTF8.GetString(body);
    Console.WriteLine($"-> {message}");
    // insert
};

channel.BasicConsume(
    queue: "chunkToDatabase",
    autoAck: true,
    consumer: consumer
);


var builder = WebApplication.CreateBuilder(args);



builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();



app.UseHttpsRedirection();

app.Run();

    List<string> GetChunk(
        string filePath = "C:/Users/darshan.mahankar/OneDrive - zeuslearning.com/Desktop/Assignments/Backend_Excel_funcDB/Excel_Chunk/users.csv"
    )
    {
        var chunk = new List<string>();
        var startLine = 0;
 
        using (var reader = new StreamReader(filePath))
        using (var csv = new CsvReader(reader, new CsvHelper.Configuration.CsvConfiguration(CultureInfo.InvariantCulture)))
        {
            csv.Read();
            csv.ReadHeader();
            int rowNo = 1;
            int colNo = 1;
            int lines = 0;
 
            // Skip lines to reach the desired chunk
            // for (int i = 0; i < startLine && csv.Read(); i++) { }
 
            // Read the chunk
            while (csv.Read() && lines < 10)
            {
                var row = csv.Parser.Record;
                for(int i = 0; i < row.Length; ++i){
                    Console.WriteLine($"rowNo={lines} colNo={i} {row[i]}");
                }
                
                ++lines;
                // chunk.Add(string.Join(",", row));
            }
        }
        Console.WriteLine("row");
 
        return chunk;
    }

