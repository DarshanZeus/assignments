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
    public class deleteDataController : ControllerBase
    {
        // private readonly ILogger<deleteDataController> _logger;
        private readonly MySqlConnection _connection;

        public deleteDataController(MySqlConnection connection)
        {
            _connection = connection;
        }
        public async Task<ActionResult> GetChunk(
            string filePath = "C:/Users/darshan.mahankar/OneDrive - zeuslearning.com/Desktop/Assignments/Backend_Excel_funcDB/Excel_Chunk/users.csv"
        )
        {
            var chunk = new List<string>();
            var startLine = 0;
    
            using (var reader = new StreamReader(filePath))
            using (var csv = new CsvReader(reader, new CsvHelper.Configuration.CsvConfiguration(CultureInfo.InvariantCulture)))
            {
                csv.Read();
                csv.ReadHeader();
                int rowNo = 1;
                int colNo = 1;
                int lines = 0;
                

                // await _connection.OpenAsync();

                // using var command = _connection.CreateCommand();
                string query = $"";

                while (csv.Read() && lines < 100001)
                {
                    var row = csv.Parser.Record;
                    for(int i = 0; i < row.Length; ++i){
                        // Console.WriteLine($"rowNo={lines} colNo={i} {row[i]}");

                        query = @"
                    INSERT INTO excel_clone.excel_data (MatrixName, RowNo, ColNo, CellValue)
                    VALUES(@MatrixName, @RowNo, @ColNo, @CellValue)
                    ON DUPLICATE KEY UPDATE 
                        MatrixName = VALUES(MatrixName), 
                        RowNo = VALUES(RowNo), 
                        ColNo = VALUES(ColNo), 
                        CellValue = VALUES(CellValue); 
                ";

                        
                        // Console.WriteLine(query);

                        MySqlCommand command = new MySqlCommand(query, _connection);
                        command.Parameters.AddWithValue("@MatrixName", 1);
                        command.Parameters.AddWithValue("@RowNo", lines+1);
                        command.Parameters.AddWithValue("@ColNo", i+1);
                        command.Parameters.AddWithValue("@CellValue", row[i]);
                        var rowsAffected = command.ExecuteNonQuery();
                    }
                    
                    ++lines;
                }
            }
            Console.WriteLine("row");
    
            return Ok();
        }

        [HttpDelete("deleteCellData")]
        public async Task<ActionResult> getPageDataAsync(cellModel cellData)
        {   
            await _connection.OpenAsync();
            await GetChunk();
            try
            {
                

                // using var command = _connection.CreateCommand();
                string query = @"
                    DELETE 
                    FROM excel_clone.excel_data
                    WHERE 
                        (MatrixName = @MatrixName) and 
                        (RowNo = @RowNo) and 
                        (ColNo = @ColNo);
                ";

                MySqlCommand command = new MySqlCommand(query, _connection);
                
                command.Parameters.AddWithValue("@MatrixName", cellData.MatrixName);
                command.Parameters.AddWithValue("@RowNo", cellData.RowNo);
                command.Parameters.AddWithValue("@ColNo", cellData.ColNo);
                
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