using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Backend_Excel.Models;

namespace Backend_Excel.Controllers
{
    [ApiController]
    [Route("api")]
    public class findAndReplaceController : ControllerBase
    {
        private readonly MySqlConnection _connection;

        public findAndReplaceController(MySqlConnection connection)
        {
            _connection = connection;
        }

        public string ConvertToTitle(int columnNumber)
        {
            string ans = "";
            while (columnNumber > 0) {
                columnNumber--;
                // Get the last character and append it at the end of string.
                ans = ((char)((columnNumber) % 26 + 'A')) + ans;
                columnNumber = (columnNumber) / 26;
            }

            return ans;
        }



        [HttpPost("findAll")]
        public async Task<ActionResult> findCellDataAsync(findAndReplace FindData)
        {
            try
            {
                await _connection.OpenAsync();
                string searchString = FindData.findStr.Replace('?', '_');

                using var command = _connection.CreateCommand();
                string query = $"SELECT MatrixName,RowNo,ColNo,CellValue FROM excel_clone.excel_data WHERE CellValue LIKE @findStr LIMIT 0,100;";
                command.CommandText = query;
                
                command.Parameters.AddWithValue("@findStr", $"%{searchString}%");
                
                using var reader = await command.ExecuteReaderAsync();

                var resData = new List<foundData>();
                

                while(await reader.ReadAsync())
                {
                    var MatrixName = (int)reader["matrixName"];
                    var RowNo = (int)reader["rowNo"];
                    var ColNo = (int)reader["colNo"];
                    var CellValue = (string)reader["cellValue"];

                    var result = new foundData();
                    result.Sheet = $"{MatrixName}";
                    result.Cell = $"{ConvertToTitle(ColNo)}{RowNo}";
                    result.Value = $"{CellValue}";

                    resData.Add(result);
                }
                
                return Ok(resData);
                
                // while(await reader.ReadAsync())
                // {
                //     count = reader.GetInt32(0);
                // }
                
                // return Ok(count);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            finally
            {
                if (_connection.State == System.Data.ConnectionState.Open)
                {
                    await _connection.CloseAsync();
                }
            }
        }

        [HttpPost("replaceAll")]
        public async Task<ActionResult> replaceCellDataAsync(findAndReplace FindData)
        {
            try
            {
                await _connection.OpenAsync();

                FindData.findStr = FindData.findStr.Replace('?', '.');

                string query = $"UPDATE excel_clone.excel_data SET `CellValue` = REGEXP_REPLACE(`CellValue`, '(?i){FindData.findStr}', '{FindData.replaceStr}') ";
                
                MySqlCommand command = new MySqlCommand(query, _connection);
                
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
