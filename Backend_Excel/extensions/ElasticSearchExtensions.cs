using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend_Excel.Models;
using Elasticsearch.Net;
using Nest;

namespace Backend_Excel.extensions
{
    public static class ElasticSearchExtensions
    {
        public static void AddElasticsearch(
            this IServiceCollection services, 
            IConfiguration configuration
        )
        {
            var url = configuration["ELKConfiguration:url"];
            var defaultIndex = configuration["ELKConfiguration:index"];

            var settings = new ConnectionSettings(new Uri("https://localhost:9200/"))
                .ServerCertificateValidationCallback(CertificateValidations.AllowAll)
                .BasicAuthentication("elastic", "WzB*7FBu-cVHcU39MIC6")
                .PrettyJson()
                .DisablePing()
                .DisableDirectStreaming() // This will capture the request and response for logging
                .EnableApiVersioningHeader()
                .DefaultIndex("rowmodel");

            AddDefaultMappings(settings);

            var client = new ElasticClient(settings);

            services.AddSingleton<IElasticClient>(client);

            if(defaultIndex != null) CreateIndex(client, defaultIndex);
        }

        private static void AddDefaultMappings(ConnectionSettings settings)
        {
            settings
                .DefaultMappingFor<RowModel>(m => m);
        }

        private static void CreateIndex(IElasticClient client, string indexName = "rowmodel")
        {
            var indexExistsResponse = client.Indices.Exists(indexName);
    
            if (indexExistsResponse.Exists)
            {
                // Console.WriteLine("Index already exists.");
                return;
            }

            var createIndexResponse = client.Indices.Create(indexName, index => index
                .Settings(s => s
                    .NumberOfShards(1)
                    .NumberOfReplicas(0)
                )
                .Map<RowModel>(m => m.AutoMap())
            );

            if (createIndexResponse.IsValid)
            {
                Console.WriteLine("Index created successfully.");
            }
            else
            {
                Console.WriteLine("Index creation failed.");
                Console.WriteLine(createIndexResponse.DebugInformation);
            }

        }
    }
}