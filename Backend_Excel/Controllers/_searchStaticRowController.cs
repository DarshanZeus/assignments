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
            [FromQuery] string query
        )
        {

            // int page = 1;
            // int pageSize = 20;
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
                return await SearchRowModelAsyncV2(query, page: 1, pageSize: 10); ;
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
        public async Task<ActionResult> SearchRowModelAsyncV2(string query, int page = 1, int pageSize = 10)
        {
            var searchResponse = await _elasticClient.SearchAsync<RowModel>(s => s
                .From((page - 1) * pageSize)
                .Size(pageSize)
                .Query(q => q.MultiMatch(m => m
                    .Fields(f => f
                        .Field(p => p.Email)
                        .Field(p => p.Name)
                        .Field(p => p.Telephone)
                        .Field(p => p.Address1)
                        .Field(p => p.DOB)
                        .Field(p => p.State)
                        .Field(p => p.City)
                        .Field(p => p.Country)
                        .Field(p => p.Address2)
                        .Field(p => p.FY_19_20)
                        .Field(p => p.FY_20_21)
                        .Field(p => p.FY_21_22)
                        .Field(p => p.FY_22_23)
                        .Field(p => p.FY_23_24)
                    )
                    .Query(query)
                    .Type(TextQueryType.PhrasePrefix)
                ))
            );

            return searchResponse.IsValid 
                ? Ok(searchResponse.Hits.Select(hit => hit.Source))
                : BadRequest($"Search failed: {searchResponse.DebugInformation}");
        }
        // public async Task<ActionResult> SearchRowModelAsync(string query, int page = 1, int pageSize = 10)
        // {
        //     var searchResponse = await _elasticClient.SearchAsync<RowModel>(s => s
        //         .From((page - 1) * pageSize)
        //         .Size(pageSize)
        //         .Query(q => q
        //             .Bool(b => b
        //                 .Should(
        //                     bs => bs.Wildcard(wc => wc
        //                         .Field(f => f.Email.Suffix("keyword"))
        //                         .Value($"*{query.ToLower()}*")
        //                         .CaseInsensitive(true)
        //                     ),
        //                     bs => bs.Wildcard(wc => wc
        //                         .Field(f => f.Name.Suffix("keyword"))
        //                         .Value($"*{query.ToLower()}*")
        //                         .CaseInsensitive(true)
        //                     ),
        //                     bs => bs.Wildcard(wc => wc
        //                         .Field(f => f.Telephone.Suffix("keyword"))
        //                         .Value($"*{query.ToLower()}*")
        //                         .CaseInsensitive(true)
        //                     ),
        //                     bs => bs.Wildcard(wc => wc
        //                         .Field(f => f.Address1.Suffix("keyword"))
        //                         .Value($"*{query.ToLower()}*")
        //                         .CaseInsensitive(true)
        //                     ),
        //                     bs => bs.Wildcard(wc => wc
        //                         .Field(f => f.DOB.Suffix("keyword"))
        //                         .Value($"*{query.ToLower()}*")
        //                         .CaseInsensitive(true)
        //                     )
        //                 )
        //             )
        //         )
        //     );

        //     if (!searchResponse.IsValid)
        //     {
        //         Console.WriteLine($"Search failed: {searchResponse.DebugInformation}");
        //         return BadRequest(searchResponse);
        //     }
        //     // return Ok(searchResponse);

        //     var results = searchResponse.Hits.Select(hit => hit.Source).ToList();
        //     return Ok(results);
        // }

        public async Task<ActionResult> SearchRowModelAsyncV0(string query, int page = 1, int pageSize = 10)
        {
            var searchQuery = query.ToLower();

            var searchDescriptor = new SearchDescriptor<RowModel>()
                .From((page - 1) * pageSize)
                .Size(pageSize)
                .Query(q => q.Bool(b => b.Should(BuildFieldQueries(searchQuery))));

            var searchResponse = await _elasticClient.SearchAsync<RowModel>(searchDescriptor);

            if (!searchResponse.IsValid)
            {
                Console.WriteLine($"Search failed: {searchResponse.DebugInformation}");
                return BadRequest(searchResponse);
            }

            var results = searchResponse.Hits.Select(hit => hit.Source).ToList();
            return Ok(results);
        }

        private static Func<QueryContainerDescriptor<RowModel>, QueryContainer>[] BuildFieldQueries(string searchQuery)
        {
            var queries = new List<Func<QueryContainerDescriptor<RowModel>, QueryContainer>>
            {
                q => q.Wildcard(wc => wc
                    .Field(f => f.Email.Suffix("keyword"))
                    .Value($"*{searchQuery}*")
                    .CaseInsensitive(true)
                ),
                q => q.Wildcard(wc => wc
                    .Field(f => f.Name.Suffix("keyword"))
                    .Value($"*{searchQuery}*")
                    .CaseInsensitive(true)
                ),
                q => q.Wildcard(wc => wc
                    .Field(f => f.Telephone.Suffix("keyword"))
                    .Value($"*{searchQuery}*")
                    .CaseInsensitive(true)
                ),
                q => q.Wildcard(wc => wc
                    .Field(f => f.Address1.Suffix("keyword"))
                    .Value($"*{searchQuery}*")
                    .CaseInsensitive(true)
                ),
                q => q.Wildcard(wc => wc
                    .Field(f => f.DOB.Suffix("keyword"))
                    .Value($"*{searchQuery}*")
                    .CaseInsensitive(true)
                ),
                q => q.Wildcard(wc => wc
                    .Field(f => f.State.Suffix("keyword"))
                    .Value($"*{searchQuery}*")
                    .CaseInsensitive(true)
                ),
                q => q.Wildcard(wc => wc
                    .Field(f => f.City.Suffix("keyword"))
                    .Value($"*{searchQuery}*")
                    .CaseInsensitive(true)
                ),
                q => q.Wildcard(wc => wc
                    .Field(f => f.Country.Suffix("keyword"))
                    .Value($"*{searchQuery}*")
                    .CaseInsensitive(true)
                ),
                q => q.Wildcard(wc => wc
                    .Field(f => f.Address2.Suffix("keyword"))
                    .Value($"*{searchQuery}*")
                    .CaseInsensitive(true)
                ),
                q => q.Wildcard(wc => wc
                    .Field(f => f.FY_19_20.Suffix("keyword"))
                    .Value($"*{searchQuery}*")
                    .CaseInsensitive(true)
                ),
                q => q.Wildcard(wc => wc
                    .Field(f => f.FY_20_21.Suffix("keyword"))
                    .Value($"*{searchQuery}*")
                    .CaseInsensitive(true)
                ),
                q => q.Wildcard(wc => wc
                    .Field(f => f.FY_21_22.Suffix("keyword"))
                    .Value($"*{searchQuery}*")
                    .CaseInsensitive(true)
                ),
                q => q.Wildcard(wc => wc
                    .Field(f => f.FY_22_23.Suffix("keyword"))
                    .Value($"*{searchQuery}*")
                    .CaseInsensitive(true)
                ),
                q => q.Wildcard(wc => wc
                    .Field(f => f.FY_23_24.Suffix("keyword"))
                    .Value($"*{searchQuery}*")
                    .CaseInsensitive(true)
                )
            };

            return queries.ToArray();
        }

        public async Task<ActionResult> SearchRowModelAsyncV3(string query, int page = 1, int pageSize = 10)
        {
            var searchResponse = await _elasticClient.SearchAsync<RowModel>(s => s
                .From((page - 1) * pageSize)
                .Size(pageSize)
                .Query(q => q
                    .Bool(b => b
                        .Should(
                            FieldQueries(query)
                        )
                    )
                )
                .Source(src => src.Includes(i => i.Field(f => f.RowNo)))
                .Highlight(h => h
                    .Fields(
                        HighlightedFields()
                    )
                )
            );

            if (!searchResponse.IsValid)
            {
                return BadRequest($"Search failed: {searchResponse.DebugInformation}");
            }

            var results = searchResponse.Hits.SelectMany(hit => 
                hit.Highlight.Select(highlight => new SearchResult
                {
                    FieldName = highlight.Key,
                    FieldValue = highlight.Value.FirstOrDefault() ?? string.Empty,
                    RowNo = hit.Source.RowNo
                })
            ).ToList();

            return Ok(results);
        }

        private static Func<QueryContainerDescriptor<RowModel>, QueryContainer>[] FieldQueries(string query)
        {
            return new Func<QueryContainerDescriptor<RowModel>, QueryContainer>[]
            {
                q => q.Match(m => m.Field(f => f.Email).Query(query)),
                q => q.Match(m => m.Field(f => f.Name).Query(query)),
                q => q.Match(m => m.Field(f => f.Country).Query(query)),
                q => q.Match(m => m.Field(f => f.State).Query(query)),
                q => q.Match(m => m.Field(f => f.City).Query(query)),
                q => q.Match(m => m.Field(f => f.Telephone).Query(query)),
                q => q.Match(m => m.Field(f => f.Address1).Query(query)),
                q => q.Match(m => m.Field(f => f.Address2).Query(query)),
                q => q.Match(m => m.Field(f => f.DOB).Query(query)),
                q => q.Match(m => m.Field(f => f.FY_19_20).Query(query)),
                q => q.Match(m => m.Field(f => f.FY_20_21).Query(query)),
                q => q.Match(m => m.Field(f => f.FY_21_22).Query(query)),
                q => q.Match(m => m.Field(f => f.FY_22_23).Query(query)),
                q => q.Match(m => m.Field(f => f.FY_23_24).Query(query))
            };
        }

        private static Func<HighlightFieldDescriptor<RowModel>, IHighlightField>[] HighlightedFields()
        {
            return new Func<HighlightFieldDescriptor<RowModel>, IHighlightField>[]
            {
                f => f.Field(p => p.Email),
                f => f.Field(p => p.Name),
                f => f.Field(p => p.Country),
                f => f.Field(p => p.State),
                f => f.Field(p => p.City),
                f => f.Field(p => p.Telephone),
                f => f.Field(p => p.Address1),
                f => f.Field(p => p.Address2),
                f => f.Field(p => p.DOB),
                f => f.Field(p => p.FY_19_20),
                f => f.Field(p => p.FY_20_21),
                f => f.Field(p => p.FY_21_22),
                f => f.Field(p => p.FY_22_23),
                f => f.Field(p => p.FY_23_24)
            };
        }

    }
}


