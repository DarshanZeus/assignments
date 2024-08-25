using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MySql.Data.MySqlClient;
using Backend_Excel.Models;

namespace Backend_Excel.Controllers
{
    [ApiController]
    [Route("api")]
    public class getChunkingStatusController : Controller
    {
        private readonly MySqlConnection _connection;

        public getChunkingStatusController(MySqlConnection connection)
        {
            _connection = connection;
        }

        [HttpGet("getUploadStatus")]
        public async Task<ActionResult> getChunkStatusAsync()
        {
            try
            {
                await _connection.OpenAsync();

                using var command = _connection.CreateCommand();
                string query = $"SELECT totalChunks,completedChunks FROM excel_clone.loadeddata;";

                command.CommandText = query;
                using var reader = await command.ExecuteReaderAsync();

                while(await reader.ReadAsync())
                {
                    
                    var completedChunks = (int)reader["completedChunks"];
                    var totalChunks = (int)reader["totalChunks"];

                    var percent = ((completedChunks * 100) / totalChunks);

                    if(percent >= 100){
                        var connectionStringLoader = "User ID=root;Password=PASSWORD;Host=localhost;Port=3306;Database=excel_clone;Protocol=TCP;Compress=false;Pooling=true;Min Pool Size=0;Max Pool Size=100;Connection Lifetime=0;";
                        var dbConnectionLoader = new MySqlConnection(connectionStringLoader);
                        
                        await dbConnectionLoader.OpenAsync();

                        string queryLoader = "DELETE FROM excel_clone.loadeddata;";
                        MySqlCommand deleteCommand = new MySqlCommand(queryLoader, dbConnectionLoader);
                        var rowsAffected = deleteCommand.ExecuteNonQuery();

                        await dbConnectionLoader.CloseAsync();
                    }

                    return Ok(percent);
                }
                
                return Ok(-1);
                
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
            finally
            {
                if (_connection.State == System.Data.ConnectionState.Open)
                {
                    await _connection.CloseAsync();
                }
                else{
                    Console.WriteLine("Connection is Already Closed");
                }
            }
        }
    }
}