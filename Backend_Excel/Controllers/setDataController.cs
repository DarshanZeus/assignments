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
    public class setDataController : ControllerBase
    {
        // private readonly ILogger<setDataController> _logger;
        private readonly MySqlConnection _connection;

        public setDataController(MySqlConnection connection)
        {
            _connection = connection;
        }

        [HttpPost("setCellData")]
        public async Task<ActionResult> getPageDataAsync(cellModel cellData)
        {
            try
            {
                // Console.WriteLine(cellData.MatrixName);
                // Console.WriteLine(cellData.RowNo);
                // Console.WriteLine(cellData.ColNo);
                // Console.WriteLine(cellData.CellValue);
                await _connection.OpenAsync();

                // using var command = _connection.CreateCommand();
                string query = @"
                    INSERT INTO excel_clone.excel_data (MatrixName, RowNo, ColNo, CellValue)
                    VALUES(@MatrixName, @RowNo, @ColNo, @CellValue)
                    ON DUPLICATE KEY UPDATE 
                        MatrixName = VALUES(MatrixName), 
                        RowNo = VALUES(RowNo), 
                        ColNo = VALUES(ColNo), 
                        CellValue = VALUES(CellValue); 
                ";

                MySqlCommand command = new MySqlCommand(query, _connection);
                
                command.Parameters.AddWithValue("@MatrixName", cellData.MatrixName);
                command.Parameters.AddWithValue("@RowNo", cellData.RowNo);
                command.Parameters.AddWithValue("@ColNo", cellData.ColNo);
                command.Parameters.AddWithValue("@CellValue", cellData.CellValue);
                
                var rowsAffected = command.ExecuteNonQuery();
                
                
                
                return Ok(rowsAffected);
                
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