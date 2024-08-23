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
    public class uploadFile_chunkingController : Controller
    {
        private readonly MySqlConnection _connection;

        public uploadFile_chunkingController(MySqlConnection connection)
        {
            _connection = connection;
        }

        [HttpPost("CSVfileUpload")]
        public async Task<ActionResult> uploadFile_chunking(List<IFormFile> file)
        {
            
            if (file == null || file.Count == 0)
            {
                return BadRequest("No file uploaded.");
            }

            long milliseconds = DateTime.Now.Ticks / TimeSpan.TicksPerMillisecond;
            string filename = milliseconds.ToString();   
            filename+=".csv";

            var filepath = Path.Combine(Directory.GetCurrentDirectory(), "Upload");
            if (!Directory.Exists(filepath))
            {
                Directory.CreateDirectory(filepath);
            }

            var exactpath = Path.Combine(Directory.GetCurrentDirectory(), "Upload", filename);
            Console.WriteLine(exactpath);
            using (var stream = new FileStream(exactpath, FileMode.Create))
            {
                await file[0].CopyToAsync(stream);
            }

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
            // Console.WriteLine(.papathth);

            int totalChunkCnt = 0;

            //// ----COUNTING TOTAL Chunk PART------- ///////////////////////////////////////////////////////////////
            using(var reader = new StreamReader(exactpath))
            {
                int listA = 0;

                int lineReadCnt = 0;
                int chunk = 5000;
                
                while (!reader.EndOfStream)
                {
                    var line = reader.ReadLine();
                    ++lineReadCnt;
                    if (line != null){
                        var values = line.Split(',');
                        for(int i = 0; i < values.Length; ++i){
                            ++listA;
                        }
                    }

                    if(listA >= chunk){
                        listA = 0;
                        totalChunkCnt++;
                    }
                }
                if(listA > 0){
                    totalChunkCnt++;
                    listA=0;
                }
            }
            var connectionStringLoader = "User ID=root;Password=PASSWORD;Host=localhost;Port=3306;Database=excel_clone;Protocol=TCP;Compress=false;Pooling=true;Min Pool Size=0;Max Pool Size=100;Connection Lifetime=0;";
            var dbConnectionLoader = new MySqlConnection(connectionStringLoader);

            
            await dbConnectionLoader.OpenAsync();
            
            
            var queryLoader = $"INSERT INTO excel_clone.loadeddata (totalChunks) VALUES('{totalChunkCnt}');";
            MySqlCommand command = new MySqlCommand(queryLoader, dbConnectionLoader);
            
            var rowsAffectedLoader = command.ExecuteNonQuery();

            await dbConnectionLoader.CloseAsync();
            // return Ok(totalChunkCnt);


            //// ----CSV READING PART------- ///////////////////////////////////////////////////////////////

            // // using(var reader = new StreamReader(@"C:\Users\darshan.mahankar\users.csv"))
            using(var reader = new StreamReader(exactpath))
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
            
            return Ok("File Uploaded SuccessFully");
        }
    }
}