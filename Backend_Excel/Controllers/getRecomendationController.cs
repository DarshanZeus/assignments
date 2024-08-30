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
using Elasticsearch.Net;
using Nest;

namespace Backend_Excel.Controllers
{
    [ApiController]
    [Route("api")]
    public class getRecomendationController : Controller
    {
        private readonly MySqlConnection _connection;
        private readonly IElasticClient _elasticClient;
        private readonly ILogger<uploadFile_chunkingController> _logger;

        public getRecomendationController(
            MySqlConnection connection,
            IElasticClient elasticClient,
            ILogger<uploadFile_chunkingController> logger
        )
        {
            _logger = logger;
            _elasticClient = elasticClient;
            _connection = connection;
        }


        [HttpPost("getRecomendation")]
        public async Task<ActionResult> getRecomendationDataAsync(
            [FromQuery] string query = "data"
        )
        {
            // Console.WriteLine($"Hit horaha");
            
            // var tempData = new List<cellModel>();
            // for (var i = 0; i < 10 ; ++i){
            //     tempData.Add(new cellModel{
            //         MatrixName = i,
            //         RowNo = i,
            //         ColNo = i,
            //         CellValue = "Sample Text"
            //     });
            // }
            // return Ok(tempData);

            int page = 1;
            int pageSize = 20;
            try
            {
                var searchResponse = await _elasticClient.SearchAsync<cellModel>(
                    s => s
                    .From((page - 1) * pageSize)
                    .Size(pageSize)
                    .Query(q => q
                        // .Match(m => m
                        //     .Field(f => f.CellValue)
                        //     .Query('*' + query + '*')
                        // )
                        .Wildcard(wc => wc
                        .Field(f => f.CellValue.Suffix("keyword")) // Ensure to use the keyword field for case-insensitive search
                        .Value($"*{query.ToLower()}*") // Lowercase the query for case insensitivity
                        .CaseInsensitive(true) // Make the wildcard query case-insensitive
                    )
                    )
                );

                if (!searchResponse.IsValid)
                {
                    return BadRequest(searchResponse.DebugInformation);
                }

                // Return only the documents found, not the entire response
                var results = searchResponse.Hits.Select(hit => hit.Source).ToList();
                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message, stackTrace = ex.StackTrace });
            }
            finally
            {
                if (_connection.State == System.Data.ConnectionState.Open)
                {
                    await _connection.CloseAsync();
                }
                // else
                // {
                //     return;
                //     Console.WriteLine("Connection is Already Closed");
                // }
            }
        }

    }
}