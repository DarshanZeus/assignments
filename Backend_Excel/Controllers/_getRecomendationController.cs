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
    public class _getRecomendationController : Controller
    {
        private readonly MySqlConnection _connection;
        private readonly IElasticClient _elasticClient;
        private readonly ILogger<_getRecomendationController> _logger;

        public _getRecomendationController(
            MySqlConnection connection,
            IElasticClient elasticClient,
            ILogger<_getRecomendationController> logger
        )
        {
            _logger = logger;
            _elasticClient = elasticClient;
            _connection = connection;
        }


        [HttpPost("_getRecomendation")]
        public async Task<ActionResult> getRecomendationDataAsync(
            [FromQuery] string query = "data"
        )
        {
            int page = 1;
            int pageSize = 20;

            try
            {
                var fieldsToSearch = new List<string>
                {
                    "Email",
                    "Name",
                    "Country",
                    "State",
                    "City",
                    "Telephone",
                    "Address1",
                    "Address2",
                    "DOB",
                    "FY_19_20",
                    "FY_20_21",
                    "FY_21_22",
                    "FY_22_23",
                    "FY_23_24"
                };

                if (fieldsToSearch.Count == 0)
                {
                    return BadRequest("No fields specified for search.");
                }

                var searchResponse = await _elasticClient.SearchAsync<RowModel>(s => s
                    .From((page - 1) * pageSize)
                    .Size(pageSize)
                    .Query(q => q
                        .Bool(b => b
                            .Should(
                                fieldsToSearch.Select(field => (Func<QueryContainerDescriptor<RowModel>, QueryContainer>)(q => q
                                    .Match(m => m
                                        .Field(field)
                                        .Query(query)
                                    )
                                )).ToArray()
                            )
                        )
                    )
                );

                if (!searchResponse.IsValid)
                {
                    _logger.LogError("Search failed: {0}", searchResponse.DebugInformation);
                    return BadRequest(searchResponse.DebugInformation);
                }

                var results = searchResponse.Hits.Select(hit => hit.Source).ToList();
                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError("Exception during search: {0}", ex.ToString());
                return BadRequest(new { message = ex.Message, stackTrace = ex.StackTrace });
            }
            finally
            {
                if (_connection.State == System.Data.ConnectionState.Open)
                {
                    await _connection.CloseAsync();
                }
            }
        }

    }
}