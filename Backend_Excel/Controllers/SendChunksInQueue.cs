using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using RabbitMQ.Client;
using MySql.Data.MySqlClient;
using Backend_Excel.Models;
using Nest;
using Elasticsearch.Net;

namespace Backend_Excel.Controllers
{
    [ApiController]
    [Route("api")]
    public class SendChunksInQueue : ControllerBase
    {
        private readonly MySqlConnection _connection;
        private readonly IElasticClient _elasticClient;

        public SendChunksInQueue(MySqlConnection connection)
        {
            var settings = new ConnectionSettings(new Uri("https://localhost:9200"))
                .DefaultIndex("cellData")
                .BasicAuthentication("elastic", "WzB*7FBu-cVHcU39MIC6")
                .ServerCertificateValidationCallback((o, certificate, chain, errors) => true);

            _elasticClient = new ElasticClient(settings);
            _connection = connection;
        }

        [HttpPost("fileUploadComplete")]
        public IActionResult SendChucksOfExcelSheet([FromBody] pathToFile path)
        {
            try
            {
                var factory = new ConnectionFactory { HostName = "localhost" };
                using var connection = factory.CreateConnection();
                using var channel = connection.CreateModel();

                channel.QueueDeclare(
                    queue: "Insert To DB",
                    durable: false,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null
                );

                using (var reader = new StreamReader(path.path))
                {
                    var listA = new List<string>();
                    var listVal = new List<string>();

                    int lineReadCnt = 0;
                    int chunk = 5000;

                    while (!reader.EndOfStream)
                    {
                        var line = reader.ReadLine();
                        ++lineReadCnt;
                        if (line != null)
                        {
                            var values = line.Split(',');
                            for (int i = 0; i < values.Length; ++i)
                            {
                                listA.Add($"({1},{lineReadCnt},{i + 1},'{values[i]}')");
                                listVal.Add(values[i]);
                            }
                        }

                        if (listA.Count >= chunk)
                        {
                            PublishData(channel, listA);
                            listVal.Clear();
                            listA.Clear();
                        }
                    }

                    if (listA.Count > 0)
                    {
                        PublishData(channel, listA);
                        listVal.Clear();
                        listA.Clear();
                    }
                }

                return Ok(path);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private void PublishData(IModel channel, List<string> listA)
        {
            var combinedString = string.Join(",", listA);
            var dataStr = Encoding.UTF8.GetBytes(combinedString);

            channel.BasicPublish(exchange: string.Empty,
                routingKey: "Insert To DB",
                mandatory: false,
                basicProperties: null,
                body: dataStr);
        }

        public async Task BulkIndexCellDataAsync(List<string> data)
        {
            var bulkDescriptor = new BulkDescriptor();

            foreach (var cell in data)
            {
                bulkDescriptor.Index<string>(op => op.Document(cell));
            }

            var bulkResponse = await _elasticClient.BulkAsync(bulkDescriptor);

            if (bulkResponse.Errors)
            {
                // Log the errors or handle them as needed
                Console.WriteLine($"{bulkResponse.Errors}");
            }
        }
    }
}
