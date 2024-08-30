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
    public class _searchStaticRowController : Controller
    {
        private readonly MySqlConnection _connection;
        private readonly IElasticClient _elasticClient;
        private readonly ILogger<uploadFile_chunkingController> _logger;

        public _searchStaticRowController(
            MySqlConnection connection,
            IElasticClient elasticClient,
            ILogger<uploadFile_chunkingController> logger
        )
        {
            _logger = logger;
            _elasticClient = elasticClient;
            _connection = connection;
        }


        [HttpPost("_searchrow")]
        public async Task<ActionResult> _searchStaticRowDataAsync(
            [FromQuery] string query = "data"
        )
        {

            int page = 1;
            int pageSize = 20;
            try
            {
                // var searchResponse = await _elasticClient.SearchAsync<cellModel>(
                //     s => s
                //     .From((page - 1) * pageSize)
                //     .Size(pageSize)
                //     .Query(q => q
                //         // .Match(m => m
                //         //     .Field(f => f.CellValue)
                //         //     .Query('*' + query + '*')
                //         // )
                //         .Wildcard(wc => wc
                //         .Field(f => f.CellValue.Suffix("keyword")) // Ensure to use the keyword field for case-insensitive search
                //         .Value($"*{query.ToLower()}*") // Lowercase the query for case insensitivity
                //         .CaseInsensitive(true) // Make the wildcard query case-insensitive
                //     )
                //     )
                // );

                // if (!searchResponse.IsValid)
                // {
                //     return BadRequest(searchResponse.DebugInformation);
                // }

                // Return only the documents found, not the entire response
                // var results = searchResponse.Hits.Select(hit => hit.Source).ToList();
                return await SearchRowModelAsync(query, page: 1, pageSize: 10);;
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
        public async Task<ActionResult> SearchRowModelAsync(string query, int page = 1, int pageSize = 10)
        {
            var searchResponse = await _elasticClient.SearchAsync<RowModel>(s => s
                .From((page - 1) * pageSize)
                .Size(pageSize)
                .Query(q => q
                    .Bool(b => b
                        .Should(
                            bs => bs.Wildcard(wc => wc
                                .Field(f => f.Email.Suffix("keyword"))
                                .Value($"*{query.ToLower()}*")
                                .CaseInsensitive(true)
                            ),
                            bs => bs.Wildcard(wc => wc
                                .Field(f => f.Name.Suffix("keyword"))
                                .Value($"*{query.ToLower()}*")
                                .CaseInsensitive(true)
                            ),
                            bs => bs.Wildcard(wc => wc
                                .Field(f => f.Telephone.Suffix("keyword"))
                                .Value($"*{query.ToLower()}*")
                                .CaseInsensitive(true)
                            ),
                            bs => bs.Wildcard(wc => wc
                                .Field(f => f.Address1.Suffix("keyword"))
                                .Value($"*{query.ToLower()}*")
                                .CaseInsensitive(true)
                            ),
                            bs => bs.Wildcard(wc => wc
                                .Field(f => f.DOB.Suffix("keyword"))
                                .Value($"*{query.ToLower()}*")
                                .CaseInsensitive(true)
                            )
                        )
                    )
                )
            );

            if (!searchResponse.IsValid)
            {
                Console.WriteLine($"Search failed: {searchResponse.DebugInformation}");
                return BadRequest(searchResponse);
            }
            // return Ok(searchResponse);

            var results = searchResponse.Hits.Select(hit => hit.Source).ToList();
            return Ok(results);
            foreach (var result in results)
            {
                Console.WriteLine($"Email: {result.Email}, Name: {result.Name}, Telephone: {result.Telephone}, Address1: {result.Address1}, DOB: {result.DOB}");
            }
            return Ok();
        }

    }
}