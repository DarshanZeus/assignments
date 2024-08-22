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
    public class getDataController : ControllerBase
    {
        // private readonly ILogger<getDataController> _logger;
        private readonly MySqlConnection _connection;

        public getDataController(MySqlConnection connection)
        {
            _connection = connection;
        }

        [HttpGet("getPageData")]
        public async Task<ActionResult> getPageDataAsync(
            [FromQuery] int matrixName = 1, 
            [FromQuery] int rowNo = 1, 
            [FromQuery] int colNo = 1
        )
        {
            try
            {
                await _connection.OpenAsync();

                using var command = _connection.CreateCommand();
                string query = $"SELECT MatrixName,RowNo,ColNo,CellValue FROM excel_clone.excel_data WHERE MatrixName = {matrixName} AND ({rowNo} <= RowNo AND RowNo < {rowNo + 100}) AND ({colNo} <= ColNo AND ColNo < {colNo + 50}) ";

                command.CommandText = query;
                using var reader = await command.ExecuteReaderAsync();

                var resData = new List<cellModel>();
                

                while(await reader.ReadAsync())
                {
                    // Console.WriteLine(reader["matrixName"].ToString());
                    // Console.WriteLine(reader["rowNo"].ToString());
                    // Console.WriteLine(reader["colNo"].ToString());
                    // Console.WriteLine(reader["cellValue"].ToString());
                    
                    var cell = new cellModel();

                    cell.MatrixName = (int)reader["matrixName"];
                    cell.RowNo = (int)reader["rowNo"];
                    cell.ColNo = (int)reader["colNo"];
                    cell.CellValue = (string)reader["cellValue"];

                    resData.Add(cell);
                }
                
                return Ok(resData);
                
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