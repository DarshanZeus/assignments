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
using Nest;
using Elasticsearch.Net;
using Mysqlx.Resultset;

namespace Backend_Excel.Controllers
{
    [ApiController]
    [Route("api")]
    public class _uploadFile_chunkingController : Controller
    {
        private readonly MySqlConnection _connection;
        private readonly IElasticClient _elasticClient;
        private readonly ILogger<uploadFile_chunkingController> _logger;

        public _uploadFile_chunkingController(
            MySqlConnection connection,
            IElasticClient elasticClient,
            ILogger<uploadFile_chunkingController> logger
        )
        {
            _logger = logger;
            _elasticClient = elasticClient;
            _connection = connection;
        }

        [HttpPost("_CSVfileUpload")]
        public async Task<ActionResult> uploadFile_chunking(SheetCSVwithID sheetCSVwithID)
        {
            if (sheetCSVwithID.file == null || sheetCSVwithID.file.Count == 0)
            {
                return BadRequest("No file uploaded.");
            }

            List<IFormFile> file = sheetCSVwithID.file;
            int sheetID = sheetCSVwithID.sheetID;

            if (file == null || file.Count == 0)
            {
                return BadRequest("No file uploaded.");
            }

            Console.WriteLine($"[x] Sheet ID : {sheetID}");
            

            long milliseconds = DateTime.Now.Ticks / TimeSpan.TicksPerMillisecond;
            string filename = milliseconds.ToString();   
            filename+=".csv";

            var filepath = Path.Combine(Directory.GetCurrentDirectory(), "Upload");
            if (!Directory.Exists(filepath))
            {
                Directory.CreateDirectory(filepath);
            }

            var exactpath = Path.Combine(Directory.GetCurrentDirectory(), "Upload", filename);
            // Console.WriteLine(exactpath);
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
            
            
            var queryLoader = $"DELETE FROM excel_clone.loadeddata; INSERT INTO excel_clone.loadeddata (totalChunks) VALUES('{totalChunkCnt}');";
            var command = new MySqlCommand(queryLoader, dbConnectionLoader);
            
            var rowsAffectedLoader = command.ExecuteNonQuery();

            await dbConnectionLoader.CloseAsync();
            // return Ok(totalChunkCnt);


            //// ----CSV READING PART------- ///////////////////////////////////////////////////////////////

            // // using(var reader = new StreamReader(@"C:\Users\darshan.mahankar\users.csv"))
            using(var reader = new StreamReader(exactpath))
            {
                var listA = new List<string>();
                var listVal = new List<RowModel>();

                int lineReadCnt = 0;
                int chunk = 1000;
                
                while (!reader.EndOfStream)
                {
                    var line = reader.ReadLine();
                    ++lineReadCnt;
                    Console.WriteLine(lineReadCnt);
                    
                    if (line != null){

                        var values = line.Split(',');
                        var row = new RowModel
                        {
                            Email = values[0],
                            Name = values[1],
                            Country = values[2],
                            State = values[3],
                            City = values[4],
                            Telephone = values[5],
                            Address1 = values[6],
                            Address2 = values[7],
                            DOB = values[8],
                            FY_19_20 = values[9],
                            FY_20_21 = values[10],
                            FY_21_22 = values[11],
                            FY_22_23 = values[12],
                            FY_23_24 = values[13],
                            RowNo = lineReadCnt
                        };
                        listVal.Add(row);
                    }

                    if(listA.Count >= chunk){
                        // var combinedString = string.Join(",", listA);
                        // var dataStr = Encoding.UTF8.GetBytes(combinedString);


                        // channel.BasicPublish(exchange: string.Empty,
                        //     routingKey: "Insert To DB",
                        //     mandatory : false,
                        //     basicProperties: null,
                        //     body: dataStr);

                        await rowBulkIndexCellDataAsync(listVal);
                        listA.Clear();
                        listVal.Clear();
                    }
                }
                if(listVal.Count > 0){
                    // var combinedString = string.Join(",", listA);
                    // var dataStr = Encoding.UTF8.GetBytes(combinedString);

                    // channel.BasicPublish(exchange: string.Empty,
                    //         routingKey: "Insert To DB",
                    //         mandatory : false,
                    //         basicProperties: null,
                    //         body: dataStr);

                    await rowBulkIndexCellDataAsync(listVal);
                    listA.Clear();
                    listVal.Clear();
                }
                
            }
            return Ok("File Uploaded SuccessFully");
        }
        public async Task rowBulkIndexCellDataAsync(List<RowModel> data)
        {
            var bulkDescriptor = new BulkDescriptor();
            Console.WriteLine(data.Count);
            

            foreach (var cell in data)
            {
                bulkDescriptor.Index<RowModel>(op => op
                    .Index("rowmodel")  
                    .Document(cell)
                );
            }

            try
            {
                var bulkResponse = await _elasticClient.BulkAsync(bulkDescriptor);

                if (bulkResponse.Errors)
                {
                    Console.WriteLine(bulkResponse.ToString());
                    Console.WriteLine("fail");
                }
                else
                {
                    Console.WriteLine(bulkResponse.ToString());
                    Console.WriteLine("success");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception during bulk indexing: {ex.Message}");
            }
        }
    }
}