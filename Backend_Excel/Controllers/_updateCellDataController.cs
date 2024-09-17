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
    public class _updateCellDataController : Controller
    {
        private readonly MySqlConnection _connection;

        public _updateCellDataController(MySqlConnection connection)
        {
            _connection = connection;
        }

        [HttpPost("_setCellData")]
        public async Task<ActionResult> _updateCellDataAsync(UpdateCellRow data)
        {
            try
            {
                await _connection.OpenAsync();

                // var listA = new List<string>();

                // foreach(var cell in data){
                //         listA.Add($"({cell.MatrixName},{cell.RowNo},{cell.ColNo},'{cell.CellValue}')");
                // }

                // var combinedString = string.Join(",", listA);
                
                string query = $"UPDATE `excel_clone`.`staticdb` SET `{data.FieldName}` = '{data.FieldValue}' WHERE (`RowNo` = '{data.RowNo}');";
                // Console.WriteLine(query);
                var command = new MySqlCommand(query, _connection);
                
                
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