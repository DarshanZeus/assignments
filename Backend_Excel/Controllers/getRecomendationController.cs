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

        public getRecomendationController(MySqlConnection connection)
        {
            var settings = new ConnectionSettings(new Uri("https://localhost:9200")) // Use HTTPS URL
                .DefaultIndex("cellModel")
                .BasicAuthentication("elastic", "WzB*7FBu-cVHcU39MIC6")  // Provide your Elasticsearch username and password
                .ServerCertificateValidationCallback((o, certificate, chain, errors) => true);
                    // CertificateValidations.AllowAll);  // Ignore SSL certificate validation (for development only)

            _elasticClient = new ElasticClient(settings);
            _connection = connection;
        }


        [HttpPost("getRecomendation")]
        public async Task<ActionResult> getRecomendationDataAsync(
            [FromQuery] string query = "data"
        )
        {
            int page = 1;
            int pageSize = 10;
            try
            {
                var searchResponse = await _elasticClient.SearchAsync<cellModel>(s => s
                    .From((page - 1) * pageSize)
                    .Size(pageSize)
                    .Query(q => q
                        .Match(m => m
                            .Field(f => f.CellValue)
                            .Query(query)
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
                else
                {
                    Console.WriteLine("Connection is Already Closed");
                }
            }
        }

    }
}