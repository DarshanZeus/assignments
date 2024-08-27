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
    public class deleteRowController : Controller
    {
        private readonly MySqlConnection _connection;

        public deleteRowController(MySqlConnection connection)
        {
            _connection = connection;
        }
        // }

        [HttpDelete("deleteRow")]
        public async Task<ActionResult> deleteRowDataAsync(MatrixRows matrixRows)
        {   
            await _connection.OpenAsync();
            
            try
            {
                int MatrixName = matrixRows.MatrixName;
                int Start = Math.Min(matrixRows.Start, matrixRows.End);
                int End = Math.Max(matrixRows.Start, matrixRows.End);
                Console.WriteLine($"{matrixRows.MatrixName} {matrixRows.Start} {matrixRows.End}");
                

                string query = $"DELETE FROM excel_clone.excel_data WHERE MatrixName = {MatrixName} AND {Start} <= RowNo AND RowNo <= {End}; UPDATE excel_clone.excel_data SET RowNo = RowNo - {End - Start + 1} WHERE MatrixName = {MatrixName} AND RowNo > {End}";

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