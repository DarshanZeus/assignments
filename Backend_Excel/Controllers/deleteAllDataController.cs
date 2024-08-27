using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MySql.Data.MySqlClient;
using Backend_Excel.Models;
using CsvHelper;
using System.Globalization;
using System.IO;

namespace Backend_Excel.Controllers
{
    [ApiController]
    [Route("api")]
    public class deleteAllDataController : Controller
    {
        private readonly MySqlConnection _connection;

        public deleteAllDataController(MySqlConnection connection)
        {
            _connection = connection;
        }

        [HttpDelete("deleteAllCellData")]
        public async Task<ActionResult> deleteAllDataAsync(cellModel cellData)
        {   
            await _connection.OpenAsync();
            try
            {
                // using var command = _connection.CreateCommand();


                // string query = $"DELETE FROM excel_clone.excel_data WHERE MatrixName = {cellData.MatrixName};";

                // var command = new MySqlCommand(query, _connection)
                // {
                //     CommandTimeout = 120
                // };

                // var rowsAffected = command.ExecuteNonQuery();
                int batchSize = 10000; // Number of rows per batch
                int totalRowsDeleted = 0;
                while (true)
                {
                    string query = $"DELETE FROM excel_clone.excel_data WHERE MatrixName = @MatrixName LIMIT {batchSize};";
                    var command = new MySqlCommand(query, _connection)
                    {
                        CommandTimeout = 120
                    };
                    command.Parameters.AddWithValue("@MatrixName", cellData.MatrixName);

                    int rowsAffected = await command.ExecuteNonQueryAsync();

                    totalRowsDeleted += rowsAffected;
                    Console.WriteLine($"{totalRowsDeleted} - {rowsAffected}");
                    

                    if (rowsAffected < batchSize)
                    {
                        break;
                    }
                }

                return Ok(totalRowsDeleted);
                
                // return Ok(rowsAffected);
                
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