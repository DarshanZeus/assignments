using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Runtime.CompilerServices;
using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using MySql.Data.MySqlClient;
using Backend_Excel.Models;

namespace Backend_Excel.Controllers
{
    [ApiController]
    [Route("api")]
    public class SendChunksInQueue : ControllerBase
    {
        // private readonly ILogger<SendChunksInQueue> _logger;
        private readonly MySqlConnection _connection;

        public SendChunksInQueue(MySqlConnection connection)
        {
            _connection = connection;
        }

        [HttpPost("fileUploadComplete")]
        public async Task<ActionResult> sendChucksOfExcelSheet(pathToFile path)
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
            Console.WriteLine(path.path);

            //// ----CSV READING PART------- ///////////////////////////////////////////////////////////////

            // // using(var reader = new StreamReader(@"C:\Users\darshan.mahankar\users.csv"))
            using(var reader = new StreamReader(path.path))
            {
                var listA = new List<string>();
                var listB = new List<string>();

                int lineReadCnt = 0;
                int chunk = 5000;
                
                while (!reader.EndOfStream)
                {
                    var line = reader.ReadLine();
                    ++lineReadCnt;
                    if (line != null){

                        var values = line.Split(',');
                        for(int i = 0; i < values.Length; ++i){
                                listA.Add($"({1},{lineReadCnt},{i+1},'{values[i]}')");
                        }
                        
                    }

                    if(listA.Count >= chunk){
                        var combinedString = string.Join(",", listA);
                        var dataStr = Encoding.UTF8.GetBytes(combinedString);


                        channel.BasicPublish(exchange: string.Empty,
                            routingKey: "Insert To DB",
                            mandatory : false,
                            basicProperties: null,
                            body: dataStr);
                            
                        listA.Clear();
                    }
                }
                if(listA.Count > 0){
                    var combinedString = string.Join(",", listA);
                    var dataStr = Encoding.UTF8.GetBytes(combinedString);

                    channel.BasicPublish(exchange: string.Empty,
                            routingKey: "Insert To DB",
                            mandatory : false,
                            basicProperties: null,
                            body: dataStr);
                            
                    listA.Clear();
                }
                
            }
            
            return Ok(path);
        }
    }
}