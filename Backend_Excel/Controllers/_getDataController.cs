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
    public class _getDataController : Controller
    {
        private readonly MySqlConnection _connection;

        public _getDataController(MySqlConnection connection)
        {
            _connection = connection;
        }

        [HttpGet("_getPageData")]
        public async Task<ActionResult> _getPageDataAsync(
            [FromQuery] int matrixName = 1, 
            [FromQuery] int rowNo = 1, 
            [FromQuery] int colNo = 1
        )
        {
            try
            {
                await _connection.OpenAsync();

                using var command = _connection.CreateCommand();
                string query = $"SELECT * FROM excel_clone.staticdb WHERE ({rowNo} <= RowNo AND RowNo < {rowNo + 100})";

                command.CommandText = query;
                using var reader = await command.ExecuteReaderAsync();

                var resData = new List<RowModel>();
                
                while (await reader.ReadAsync())
                {
                    var cell = new RowModel
                    {
                        RowNo = (int)reader["RowNo"],
                        Email = (string)reader["Email"],
                        Name = (string)reader["Name"],
                        Country = (string)reader["Country"],
                        State = (string)reader["State"],
                        City = (string)reader["City"],
                        Telephone = (string)reader["Telephone"],
                        Address1 = (string)reader["Address1"],
                        Address2 = (string)reader["Address2"],
                        DOB = (string)reader["DOB"],
                        FY_19_20 = (string)reader["FY_19_20"],
                        FY_20_21 = (string)reader["FY_20_21"],
                        FY_21_22 = (string)reader["FY_21_22"],
                        FY_22_23 = (string)reader["FY_22_23"],
                        FY_23_24 = (string)reader["FY_23_24"]
                    };

                    resData.Add(cell);
                }
                
                return Ok(resData);
            }
            catch (Exception ex)
            {
                // Create a simple error message object
                var errorResponse = new
                {
                    message = "An error occurred while processing your request.",
                    exceptionMessage = ex.Message, // Serialize only the Message property
                    stackTrace = ex.StackTrace // Optional: Include stack trace for debugging
                };

                return BadRequest(errorResponse);
            }
            finally
            {
                if (_connection.State == System.Data.ConnectionState.Open)
                {
                    await _connection.CloseAsync();
                }
                else
                {
                    Console.WriteLine("Connection is already closed.");
                }
            }
        }
    }
}
